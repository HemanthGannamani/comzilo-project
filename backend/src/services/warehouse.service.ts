/* eslint-disable @typescript-eslint/no-explicit-any */
import { WarehouseRepository } from '../repositories/warehouse.repository';
import { InventoryBalanceRepository } from '../repositories/inventoryBalance.repository';
import { Warehouse } from '../database/models/warehouse';
import { InventoryBalance } from '../database/models/inventoryBalance';
import { NotFoundError, ConflictError, ValidationError } from '../shared/errors/AppError';
import { sequelize } from '../config/database';
import { Op } from 'sequelize';

export class WarehouseService {
  private warehouseRepo: WarehouseRepository;
  private balanceRepo: InventoryBalanceRepository;

  constructor() {
    this.warehouseRepo = new WarehouseRepository();
    this.balanceRepo = new InventoryBalanceRepository();
  }

  public async createWarehouse(
    tenantId: number,
    storeId: number,
    userId: number,
    data: any
  ): Promise<Warehouse> {
    // Validate uniqueness of code and name per tenant/store
    const existingCode = await this.warehouseRepo.findScopedOne(tenantId, storeId, {
      where: { code: data.code },
      paranoid: false,
    });
    if (existingCode) {
      throw new ConflictError(`Warehouse with code '${data.code}' already exists.`);
    }

    const existingName = await this.warehouseRepo.findScopedOne(tenantId, storeId, {
      where: { name: data.name },
      paranoid: false,
    });
    if (existingName) {
      throw new ConflictError(`Warehouse with name '${data.name}' already exists.`);
    }

    const warehouse = await sequelize.transaction(async (t) => {
      // If isDefault is true, unset other defaults
      if (data.isDefault) {
        await this.warehouseRepo.dbModel.update(
          { isDefault: false },
          {
            where: { tenant_id: tenantId, store_id: storeId, is_default: true },
            transaction: t,
          }
        );
      } else {
        // If there are no warehouses yet, make this one default
        const count = await this.warehouseRepo.dbModel.count({
          where: { tenant_id: tenantId, store_id: storeId },
          transaction: t,
        });
        if (count === 0) {
          data.isDefault = true;
        }
      }

      return this.warehouseRepo.createScoped(
        tenantId,
        storeId,
        {
          ...data,
          createdBy: userId,
          updatedBy: userId,
        },
        { transaction: t }
      );
    });

    return warehouse;
  }

  public async getWarehouse(tenantId: number, storeId: number, id: number): Promise<Warehouse> {
    const warehouse = await this.warehouseRepo.findScopedById(tenantId, storeId, id);
    if (!warehouse) {
      throw new NotFoundError(`Warehouse with ID ${id} not found.`);
    }
    return warehouse;
  }

  public async listWarehouses(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<Warehouse[]> {
    return this.warehouseRepo.findScopedMany(tenantId, storeId, options);
  }

  public async updateWarehouse(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number,
    data: any
  ): Promise<Warehouse> {
    const warehouse = await this.getWarehouse(tenantId, storeId, id);

    if (data.code && data.code !== warehouse.code) {
      const existing = await this.warehouseRepo.findScopedOne(tenantId, storeId, {
        where: { code: data.code, id: { [Op.ne]: id } },
        paranoid: false,
      });
      if (existing) {
        throw new ConflictError(`Warehouse with code '${data.code}' already exists.`);
      }
    }

    if (data.name && data.name !== warehouse.name) {
      const existing = await this.warehouseRepo.findScopedOne(tenantId, storeId, {
        where: { name: data.name, id: { [Op.ne]: id } },
        paranoid: false,
      });
      if (existing) {
        throw new ConflictError(`Warehouse with name '${data.name}' already exists.`);
      }
    }

    await sequelize.transaction(async (t) => {
      if (data.isDefault && !warehouse.isDefault) {
        await this.warehouseRepo.dbModel.update(
          { isDefault: false },
          {
            where: { tenant_id: tenantId, store_id: storeId, is_default: true },
            transaction: t,
          }
        );
      } else if (data.isDefault === false && warehouse.isDefault) {
        throw new ValidationError(
          'Cannot unset default warehouse. Set another warehouse as default instead.'
        );
      }

      await this.warehouseRepo.updateScoped(
        tenantId,
        storeId,
        id,
        {
          ...data,
          updatedBy: userId,
        },
        { transaction: t }
      );
    });

    return this.getWarehouse(tenantId, storeId, id);
  }

  public async setDefaultWarehouse(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number
  ): Promise<Warehouse> {
    return this.updateWarehouse(tenantId, storeId, id, userId, { isDefault: true });
  }

  public async deleteWarehouse(tenantId: number, storeId: number, id: number): Promise<void> {
    const warehouse = await this.getWarehouse(tenantId, storeId, id);

    if (warehouse.isDefault) {
      const nextWarehouse = await this.warehouseRepo.dbModel.findOne({
        where: {
          tenant_id: tenantId,
          store_id: storeId,
          id: { [Op.ne]: id },
          status: 'active',
          deleted_at: null,
        },
        order: [['id', 'ASC']],
      });

      if (nextWarehouse) {
        nextWarehouse.isDefault = true;
        await nextWarehouse.save();
      } else {
        throw new ValidationError(
          'Cannot delete the only warehouse for your store. Create another warehouse first.'
        );
      }
    }

    // Check if the warehouse has existing stock (quantityOnHand > 0)
    const stockCount = await InventoryBalance.count({
      where: {
        tenantId,
        storeId,
        warehouseId: id,
        quantityOnHand: { [Op.gt]: 0 },
      },
    });

    if (stockCount > 0) {
      throw new ValidationError('Cannot delete warehouse with existing inventory stock.');
    }

    await this.warehouseRepo.deleteScoped(tenantId, storeId, id);
  }

  public async restoreWarehouse(tenantId: number, storeId: number, id: number): Promise<Warehouse> {
    const restored = await this.warehouseRepo.restoreScoped(tenantId, storeId, id);
    if (!restored) {
      throw new NotFoundError(`Archived Warehouse with ID ${id} not found.`);
    }
    return restored;
  }
}
