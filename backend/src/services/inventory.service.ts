/* eslint-disable @typescript-eslint/no-explicit-any */
import { InventoryBalanceRepository } from '../repositories/inventoryBalance.repository';
import { StockMovementRepository } from '../repositories/stockMovement.repository';
import { WarehouseRepository } from '../repositories/warehouse.repository';
import { WarehouseLocationRepository } from '../repositories/warehouseLocation.repository';
import { Product } from '../database/models/product';
import { InventoryBalance } from '../database/models/inventoryBalance';
import { StockMovement } from '../database/models/stockMovement';
import { NotFoundError, ValidationError } from '../shared/errors/AppError';
import { sequelize } from '../config/database';
import { Transaction, Op } from 'sequelize';

export interface StockMutationParams {
  tenantId: number;
  storeId: number;
  warehouseId: number;
  warehouseLocationId: number;
  productId: number;
  movementType: StockMovement['movementType'];
  direction: StockMovement['direction'];
  quantity: number;
  referenceType?: string | null;
  referenceId?: string | null;
  reason?: string | null;
  notes?: string | null;
  idempotencyKey?: string | null;
  performedBy: number;
}

export class InventoryService {
  private balanceRepo: InventoryBalanceRepository;
  private movementRepo: StockMovementRepository;
  private warehouseRepo: WarehouseRepository;
  private locationRepo: WarehouseLocationRepository;

  constructor() {
    this.balanceRepo = new InventoryBalanceRepository();
    this.movementRepo = new StockMovementRepository();
    this.warehouseRepo = new WarehouseRepository();
    this.locationRepo = new WarehouseLocationRepository();
  }

  /**
   * Centralised stock mutation method.
   * Runs inside a Sequelize transaction with a row-level lock (SELECT FOR UPDATE).
   */
  public async mutateStock(
    params: StockMutationParams,
    existingTransaction?: Transaction
  ): Promise<InventoryBalance> {
    const {
      tenantId,
      storeId,
      warehouseId,
      warehouseLocationId,
      productId,
      movementType,
      direction,
      quantity,
      referenceType = null,
      referenceId = null,
      reason = null,
      notes = null,
      idempotencyKey = null,
      performedBy,
    } = params;

    if (quantity < 0) {
      throw new ValidationError('Mutation quantity must be positive.');
    }

    const executeMutation = async (transaction: Transaction) => {
      // 1. Idempotency Check
      if (idempotencyKey) {
        const existingMovement = await this.movementRepo.findOne(tenantId, {
          where: { idempotency_key: idempotencyKey },
          transaction,
        });
        if (existingMovement) {
          // Idempotency matches: return current balance state
          const balance = await this.balanceRepo.findOne(tenantId, {
            where: {
              warehouse_id: warehouseId,
              warehouse_location_id: warehouseLocationId,
              product_id: productId,
            },
            transaction,
          });
          if (balance) return balance;
        }
      }

      // Verify Product exists
      const product = await Product.findOne({
        where: { id: productId, tenantId, storeId },
        transaction,
      });
      if (!product) {
        throw new NotFoundError(`Product with ID ${productId} not found.`);
      }

      // Verify Warehouse and location exist, are active, and belong to tenant/store
      const warehouse = await this.warehouseRepo.findScopedById(tenantId, storeId, warehouseId, {
        transaction,
      });
      if (!warehouse) {
        throw new NotFoundError(`Warehouse with ID ${warehouseId} not found.`);
      }
      if (warehouse.status !== 'active') {
        throw new ValidationError(`Warehouse is inactive or archived.`);
      }

      const location = await this.locationRepo.findScopedById(
        tenantId,
        storeId,
        warehouseLocationId,
        { transaction }
      );
      if (!location) {
        throw new NotFoundError(`Warehouse Location with ID ${warehouseLocationId} not found.`);
      }
      if (location.status !== 'active') {
        throw new ValidationError(`Warehouse Location is inactive or archived.`);
      }
      if (location.warehouseId !== warehouseId) {
        throw new ValidationError(`Location does not belong to the stated warehouse.`);
      }

      // 2. Lock & read current balance
      let balance = await this.balanceRepo.findOne(tenantId, {
        where: {
          warehouse_id: warehouseId,
          warehouse_location_id: warehouseLocationId,
          product_id: productId,
        },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!balance) {
        balance = await this.balanceRepo.createScoped(
          tenantId,
          storeId,
          {
            warehouseId,
            warehouseLocationId,
            productId,
            quantityOnHand: 0,
            quantityReserved: 0,
            quantityAvailable: 0,
          },
          { transaction }
        );
        // Refetch with lock
        balance = (await this.balanceRepo.findOne(tenantId, {
          where: { id: balance.id },
          lock: transaction.LOCK.UPDATE,
          transaction,
        })) as InventoryBalance;
      }

      const qBefore = balance.quantityOnHand;
      let newOnHand = balance.quantityOnHand;
      let newReserved = balance.quantityReserved;

      // 3. Mutate fields based on movement type & direction
      if (movementType === 'reservation') {
        newReserved += quantity;
      } else if (movementType === 'reservation_release') {
        newReserved -= quantity;
      } else if (movementType === 'reservation_fulfillment') {
        newReserved -= quantity;
        newOnHand -= quantity;
      } else {
        // Standard in/out
        if (direction === 'in') {
          newOnHand += quantity;
        } else if (direction === 'out') {
          newOnHand -= quantity;
        }
      }

      const newAvailable = newOnHand - newReserved;

      // 4. Validate boundaries (No negative stock)
      if (newOnHand < 0) {
        throw new ValidationError(
          `Insufficient stock on hand for product ID ${productId}. Available: ${qBefore}.`
        );
      }
      if (newReserved < 0) {
        throw new ValidationError(`Reserved stock cannot be negative.`);
      }
      if (newAvailable < 0) {
        throw new ValidationError(`Insufficient available stock for product ID ${productId}.`);
      }

      // 5. Update Balance
      await balance.update(
        {
          quantityOnHand: newOnHand,
          quantityReserved: newReserved,
          quantityAvailable: newAvailable,
          lastMovementAt: new Date(),
        },
        { transaction }
      );

      // 6. Create Stock Movement Ledger entry
      await this.movementRepo.createScoped(
        tenantId,
        storeId,
        {
          warehouseId,
          warehouseLocationId,
          productId,
          movementType,
          direction,
          quantity,
          quantityBefore: qBefore,
          quantityAfter: newOnHand,
          referenceType,
          referenceId,
          reason,
          notes,
          idempotencyKey,
          performedBy,
        },
        { transaction }
      );

      return balance;
    };

    if (existingTransaction) {
      return executeMutation(existingTransaction);
    } else {
      return sequelize.transaction(async (t) => {
        return executeMutation(t);
      });
    }
  }

  public async getProductInventory(
    tenantId: number,
    storeId: number,
    productId: number
  ): Promise<InventoryBalance[]> {
    return this.balanceRepo.findScopedMany(tenantId, storeId, {
      where: { product_id: productId },
      include: [
        { model: this.warehouseRepo.dbModel, as: 'warehouse' },
        { model: this.locationRepo.dbModel, as: 'location' },
      ],
    });
  }

  public async getBalance(
    tenantId: number,
    storeId: number,
    id: number
  ): Promise<InventoryBalance> {
    const balance = await this.balanceRepo.findScopedById(tenantId, storeId, id, {
      include: [
        { model: this.warehouseRepo.dbModel, as: 'warehouse' },
        { model: this.locationRepo.dbModel, as: 'location' },
      ],
    });
    if (!balance) {
      throw new NotFoundError(`Inventory Balance with ID ${id} not found.`);
    }
    return balance;
  }

  public async updateReorderSettings(
    tenantId: number,
    storeId: number,
    id: number,
    data: any
  ): Promise<InventoryBalance> {
    const balance = await this.getBalance(tenantId, storeId, id);
    await balance.update({
      reorderPoint: data.reorderPoint ?? balance.reorderPoint,
      reorderQuantity: data.reorderQuantity ?? balance.reorderQuantity,
      safetyStock: data.safetyStock ?? balance.safetyStock,
    });
    return balance;
  }

  public async listLowStock(
    tenantId: number,
    storeId: number,
    filters: any = {}
  ): Promise<{ rows: InventoryBalance[]; count: number }> {
    const whereClause: any = {
      tenant_id: tenantId,
      store_id: storeId,
      quantity_available: {
        [Op.lte]: sequelize.col('reorder_point'),
      },
    };

    if (filters.warehouseId) {
      whereClause.warehouse_id = filters.warehouseId;
    }
    if (filters.warehouseLocationId) {
      whereClause.warehouse_location_id = filters.warehouseLocationId;
    }
    if (filters.productId) {
      whereClause.product_id = filters.productId;
    }

    const limit = filters.limit ? Number(filters.limit) : 20;
    const offset = filters.offset ? Number(filters.offset) : 0;

    const { rows, count } = await this.balanceRepo.findAndCountAllScoped(tenantId, storeId, {
      where: whereClause,
      limit,
      offset,
      include: [
        { model: this.warehouseRepo.dbModel, as: 'warehouse' },
        { model: this.locationRepo.dbModel, as: 'location' },
        { model: Product, as: 'product' },
      ],
      order: [['quantity_available', 'ASC']],
    });

    return { rows, count };
  }

  public async listBalances(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<InventoryBalance[]> {
    return this.balanceRepo.findScopedMany(tenantId, storeId, options);
  }
}
