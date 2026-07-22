import { Request, Response, NextFunction } from 'express';
import { WarehouseService } from '../services/warehouse.service';
import { createAuditLog } from '../utils/auditHelper';
import { success, created } from '../shared/responses';
import { ValidationError } from '../shared/errors/AppError';
import { RESPONSE_MESSAGES } from '../shared/constants';

export class WarehouseController {
  private warehouseService: WarehouseService;

  constructor() {
    this.warehouseService = new WarehouseService();
  }

  private getStoreId(req: Request): number {
    const storeId = Number(req.headers['x-store-id'] || req.query.storeId || req.body.storeId);
    if (!storeId || isNaN(storeId)) {
      throw new ValidationError('Store context is missing');
    }
    return storeId;
  }

  public createWarehouse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;

      const warehouse = await this.warehouseService.createWarehouse(
        tenantId,
        storeId,
        userId,
        req.body
      );

      await createAuditLog(
        {
          tenantId,
          action: 'WAREHOUSE_CREATED',
          entityType: 'warehouse',
          entityId: String(warehouse.id),
          newValues: warehouse.toJSON(),
        },
        req.context
      );

      created(res, 'Warehouse created successfully', warehouse);
    } catch (error) {
      next(error);
    }
  };

  public getWarehouse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const warehouseId = parseInt(req.params.id, 10);

      const warehouse = await this.warehouseService.getWarehouse(tenantId, storeId, warehouseId);

      success(res, RESPONSE_MESSAGES.SUCCESS, warehouse);
    } catch (error) {
      next(error);
    }
  };

  public listWarehouses = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);

      const warehouses = await this.warehouseService.listWarehouses(tenantId, storeId, req.query);

      success(res, RESPONSE_MESSAGES.SUCCESS, warehouses);
    } catch (error) {
      next(error);
    }
  };

  public updateWarehouse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const warehouseId = parseInt(req.params.id, 10);

      const oldWarehouse = await this.warehouseService.getWarehouse(tenantId, storeId, warehouseId);
      const warehouse = await this.warehouseService.updateWarehouse(
        tenantId,
        storeId,
        warehouseId,
        userId,
        req.body
      );

      await createAuditLog(
        {
          tenantId,
          action: 'WAREHOUSE_UPDATED',
          entityType: 'warehouse',
          entityId: String(warehouse.id),
          previousValues: oldWarehouse.toJSON(),
          newValues: warehouse.toJSON(),
        },
        req.context
      );

      success(res, 'Warehouse updated successfully', warehouse);
    } catch (error) {
      next(error);
    }
  };

  public setDefaultWarehouse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const warehouseId = parseInt(req.params.id, 10);

      const oldWarehouse = await this.warehouseService.getWarehouse(tenantId, storeId, warehouseId);
      const warehouse = await this.warehouseService.setDefaultWarehouse(
        tenantId,
        storeId,
        warehouseId,
        userId
      );

      await createAuditLog(
        {
          tenantId,
          action: 'WAREHOUSE_DEFAULT_CHANGED',
          entityType: 'warehouse',
          entityId: String(warehouse.id),
          previousValues: oldWarehouse.toJSON(),
          newValues: warehouse.toJSON(),
        },
        req.context
      );

      success(res, 'Default warehouse updated successfully', warehouse);
    } catch (error) {
      next(error);
    }
  };

  public deleteWarehouse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const warehouseId = parseInt(req.params.id, 10);

      const oldWarehouse = await this.warehouseService.getWarehouse(tenantId, storeId, warehouseId);
      await this.warehouseService.deleteWarehouse(tenantId, storeId, warehouseId);

      await createAuditLog(
        {
          tenantId,
          action: 'WAREHOUSE_DELETED',
          entityType: 'warehouse',
          entityId: String(warehouseId),
          previousValues: oldWarehouse.toJSON(),
        },
        req.context
      );

      success(res, 'Warehouse deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  public restoreWarehouse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const warehouseId = parseInt(req.params.id, 10);

      const warehouse = await this.warehouseService.restoreWarehouse(
        tenantId,
        storeId,
        warehouseId
      );

      await createAuditLog(
        {
          tenantId,
          action: 'WAREHOUSE_RESTORED',
          entityType: 'warehouse',
          entityId: String(warehouseId),
          newValues: warehouse.toJSON(),
        },
        req.context
      );

      success(res, 'Warehouse restored successfully', warehouse);
    } catch (error) {
      next(error);
    }
  };
}
