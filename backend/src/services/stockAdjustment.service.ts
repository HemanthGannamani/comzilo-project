/* eslint-disable @typescript-eslint/no-explicit-any */
import { StockAdjustmentRepository } from '../repositories/stockAdjustment.repository';
import { StockAdjustment } from '../database/models/stockAdjustment';
import { InventoryService } from './inventory.service';
import { NotFoundError, ValidationError } from '../shared/errors/AppError';
import { sequelize } from '../config/database';

export class StockAdjustmentService {
  private adjustmentRepo: StockAdjustmentRepository;
  private inventoryService: InventoryService;

  constructor() {
    this.adjustmentRepo = new StockAdjustmentRepository();
    this.inventoryService = new InventoryService();
  }

  public async createAdjustment(
    tenantId: number,
    storeId: number,
    userId: number,
    data: any
  ): Promise<StockAdjustment> {
    return this.adjustmentRepo.createScoped(tenantId, storeId, {
      ...data,
      status: 'pending',
      requestedBy: userId,
    });
  }

  public async getAdjustment(
    tenantId: number,
    storeId: number,
    id: number
  ): Promise<StockAdjustment> {
    const adjustment = await this.adjustmentRepo.findScopedById(tenantId, storeId, id);
    if (!adjustment) {
      throw new NotFoundError(`Stock Adjustment with ID ${id} not found.`);
    }
    return adjustment;
  }

  public async listAdjustments(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<StockAdjustment[]> {
    return this.adjustmentRepo.findScopedMany(tenantId, storeId, options);
  }

  public async approveAdjustment(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number
  ): Promise<StockAdjustment> {
    const adjustment = await this.getAdjustment(tenantId, storeId, id);

    if (adjustment.status === 'approved') {
      return adjustment; // Idempotent approval
    }
    if (adjustment.status !== 'pending') {
      throw new ValidationError(`Cannot approve an adjustment with status '${adjustment.status}'.`);
    }

    return sequelize.transaction(async (t) => {
      // Fetch balance to calculate set_absolute delta if needed
      let direction: 'in' | 'out' | 'neutral' = 'neutral';
      let mutateQty = adjustment.quantity;
      let movementType: 'adjustment_in' | 'adjustment_out' | 'correction' = 'correction';

      if (adjustment.adjustmentType === 'set_absolute') {
        const balances = await this.inventoryService.getProductInventory(
          tenantId,
          storeId,
          adjustment.productId
        );
        const currentBalance = balances.find(
          (b) =>
            b.warehouseId === adjustment.warehouseId &&
            b.warehouseLocationId === adjustment.warehouseLocationId
        );
        const currentOnHand = currentBalance ? currentBalance.quantityOnHand : 0;
        const delta = adjustment.quantity - currentOnHand;

        if (delta > 0) {
          direction = 'in';
          mutateQty = delta;
          movementType = 'correction';
        } else if (delta < 0) {
          direction = 'out';
          mutateQty = Math.abs(delta);
          movementType = 'correction';
        } else {
          // No mutation needed (delta is 0)
          mutateQty = 0;
        }
      } else {
        direction = adjustment.adjustmentType === 'increase' ? 'in' : 'out';
        movementType = direction === 'in' ? 'adjustment_in' : 'adjustment_out';
      }

      if (mutateQty > 0) {
        await this.inventoryService.mutateStock(
          {
            tenantId,
            storeId,
            warehouseId: adjustment.warehouseId,
            warehouseLocationId: adjustment.warehouseLocationId,
            productId: adjustment.productId,
            movementType,
            direction,
            quantity: mutateQty,
            referenceType: 'StockAdjustment',
            referenceId: adjustment.id.toString(),
            reason: adjustment.reason,
            notes: adjustment.notes,
            performedBy: userId,
          },
          t
        );
      }

      await adjustment.update(
        {
          status: 'approved',
          approvedBy: userId,
          approvedAt: new Date(),
        },
        { transaction: t }
      );

      return adjustment;
    });
  }

  public async rejectAdjustment(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number
  ): Promise<StockAdjustment> {
    const adjustment = await this.getAdjustment(tenantId, storeId, id);

    if (adjustment.status !== 'pending') {
      throw new ValidationError(`Cannot reject an adjustment with status '${adjustment.status}'.`);
    }

    await adjustment.update({
      status: 'rejected',
      approvedBy: userId,
      approvedAt: new Date(),
    });

    return adjustment;
  }

  public async cancelAdjustment(
    tenantId: number,
    storeId: number,
    id: number,
    _userId: number
  ): Promise<StockAdjustment> {
    const adjustment = await this.getAdjustment(tenantId, storeId, id);

    if (adjustment.status !== 'pending') {
      throw new ValidationError(`Cannot cancel an adjustment with status '${adjustment.status}'.`);
    }

    await adjustment.update({
      status: 'cancelled',
    });

    return adjustment;
  }
}
