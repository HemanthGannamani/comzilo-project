/* eslint-disable @typescript-eslint/no-explicit-any */
import { WarehouseLocationRepository } from '../repositories/warehouseLocation.repository';
import { WarehouseRepository } from '../repositories/warehouse.repository';
import { InventoryBalanceRepository } from '../repositories/inventoryBalance.repository';
import { WarehouseLocation } from '../database/models/warehouseLocation';
import { NotFoundError, ConflictError, ValidationError } from '../shared/errors/AppError';
import { sequelize } from '../config/database';
import { Op } from 'sequelize';

export class WarehouseLocationService {
  private locationRepo: WarehouseLocationRepository;
  private warehouseRepo: WarehouseRepository;
  private balanceRepo: InventoryBalanceRepository;

  constructor() {
    this.locationRepo = new WarehouseLocationRepository();
    this.warehouseRepo = new WarehouseRepository();
    this.balanceRepo = new InventoryBalanceRepository();
  }

  public async createLocation(
    tenantId: number,
    storeId: number,
    warehouseId: number,
    userId: number,
    data: any
  ): Promise<WarehouseLocation> {
    // Verify warehouse exists and matches tenant/store
    const warehouse = await this.warehouseRepo.findScopedById(tenantId, storeId, warehouseId);
    if (!warehouse) {
      throw new NotFoundError(`Warehouse with ID ${warehouseId} not found.`);
    }

    // Code unique inside the warehouse
    const existing = await this.locationRepo.findScopedOne(tenantId, storeId, {
      where: { warehouse_id: warehouseId, code: data.code },
      paranoid: false,
    });
    if (existing) {
      throw new ConflictError(
        `Location with code '${data.code}' already exists in this warehouse.`
      );
    }

    const location = await sequelize.transaction(async (t) => {
      if (data.isDefault) {
        await this.locationRepo.dbModel.update(
          { isDefault: false },
          {
            where: {
              tenant_id: tenantId,
              store_id: storeId,
              warehouse_id: warehouseId,
              is_default: true,
            },
            transaction: t,
          }
        );
      } else {
        const count = await this.locationRepo.dbModel.count({
          where: { tenant_id: tenantId, store_id: storeId, warehouse_id: warehouseId },
          transaction: t,
        });
        if (count === 0) {
          data.isDefault = true;
        }
      }

      return this.locationRepo.createScoped(
        tenantId,
        storeId,
        {
          ...data,
          warehouseId,
          createdBy: userId,
          updatedBy: userId,
        },
        { transaction: t }
      );
    });

    return location;
  }

  public async getLocation(
    tenantId: number,
    storeId: number,
    id: number
  ): Promise<WarehouseLocation> {
    const location = await this.locationRepo.findScopedById(tenantId, storeId, id);
    if (!location) {
      throw new NotFoundError(`Warehouse Location with ID ${id} not found.`);
    }
    return location;
  }

  public async listLocations(
    tenantId: number,
    storeId: number,
    warehouseId: number,
    options: any = {}
  ): Promise<WarehouseLocation[]> {
    const opts = {
      ...options,
      where: {
        ...options.where,
        warehouse_id: warehouseId,
      },
    };
    return this.locationRepo.findScopedMany(tenantId, storeId, opts);
  }

  public async updateLocation(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number,
    data: any
  ): Promise<WarehouseLocation> {
    const location = await this.getLocation(tenantId, storeId, id);

    if (data.code && data.code !== location.code) {
      const existing = await this.locationRepo.findScopedOne(tenantId, storeId, {
        where: { warehouse_id: location.warehouseId, code: data.code, id: { [Op.ne]: id } },
        paranoid: false,
      });
      if (existing) {
        throw new ConflictError(
          `Location with code '${data.code}' already exists in this warehouse.`
        );
      }
    }

    await sequelize.transaction(async (t) => {
      if (data.isDefault && !location.isDefault) {
        await this.locationRepo.dbModel.update(
          { isDefault: false },
          {
            where: {
              tenant_id: tenantId,
              store_id: storeId,
              warehouse_id: location.warehouseId,
              is_default: true,
            },
            transaction: t,
          }
        );
      } else if (data.isDefault === false && location.isDefault) {
        throw new ValidationError(
          'Cannot unset default location. Set another location as default instead.'
        );
      }

      await this.locationRepo.updateScoped(
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

    return this.getLocation(tenantId, storeId, id);
  }

  public async setDefaultLocation(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number
  ): Promise<WarehouseLocation> {
    return this.updateLocation(tenantId, storeId, id, userId, { isDefault: true });
  }

  public async deleteLocation(tenantId: number, storeId: number, id: number): Promise<void> {
    const location = await this.getLocation(tenantId, storeId, id);

    if (location.isDefault) {
      throw new ValidationError(
        'Cannot delete the default location. Assign another default location first.'
      );
    }

    // Check if location has stock
    const stockCount = await this.balanceRepo.dbModel.count({
      where: {
        tenant_id: tenantId,
        store_id: storeId,
        warehouse_location_id: id,
        quantity_on_hand: { [Op.gt]: 0 },
      },
    });

    if (stockCount > 0) {
      throw new ValidationError('Cannot delete location with existing stock.');
    }

    await this.locationRepo.deleteScoped(tenantId, storeId, id);
  }

  public async restoreLocation(
    tenantId: number,
    storeId: number,
    id: number
  ): Promise<WarehouseLocation> {
    const restored = await this.locationRepo.restoreScoped(tenantId, storeId, id);
    if (!restored) {
      throw new NotFoundError(`Archived Location with ID ${id} not found.`);
    }
    return restored;
  }
}
