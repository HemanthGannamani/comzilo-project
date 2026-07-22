import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';
import { StockMovementService } from '../services/stockMovement.service';
import { createAuditLog } from '../utils/auditHelper';
import { success } from '../shared/responses';
import { ValidationError } from '../shared/errors/AppError';
import { RESPONSE_MESSAGES } from '../shared/constants';

export class InventoryController {
  private inventoryService: InventoryService;
  private movementService: StockMovementService;

  constructor() {
    this.inventoryService = new InventoryService();
    this.movementService = new StockMovementService();
  }

  private getStoreId(req: Request): number {
    const storeId = Number(req.headers['x-store-id'] || req.query.storeId || req.body.storeId);
    if (!storeId || isNaN(storeId)) {
      throw new ValidationError('Store context is missing');
    }
    return storeId;
  }

  public getProductInventory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const productId = parseInt(req.params.productId, 10);

      const balances = await this.inventoryService.getProductInventory(
        tenantId,
        storeId,
        productId
      );

      success(res, RESPONSE_MESSAGES.SUCCESS, balances);
    } catch (error) {
      next(error);
    }
  };

  public getBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const id = parseInt(req.params.id, 10);

      const balance = await this.inventoryService.getBalance(tenantId, storeId, id);

      success(res, RESPONSE_MESSAGES.SUCCESS, balance);
    } catch (error) {
      next(error);
    }
  };

  public listBalances = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);

      const balances = await this.inventoryService.listBalances(tenantId, storeId, req.query);

      success(res, RESPONSE_MESSAGES.SUCCESS, balances);
    } catch (error) {
      next(error);
    }
  };

  public updateReorderSettings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const id = parseInt(req.params.id, 10);

      const oldBalance = await this.inventoryService.getBalance(tenantId, storeId, id);
      const balance = await this.inventoryService.updateReorderSettings(
        tenantId,
        storeId,
        id,
        req.body
      );

      await createAuditLog(
        {
          tenantId,
          action: 'INVENTORY_REORDER_SETTINGS_UPDATED',
          entityType: 'inventory_balance',
          entityId: String(balance.id),
          previousValues: oldBalance.toJSON(),
          newValues: balance.toJSON(),
        },
        req.context
      );

      success(res, 'Reorder settings updated successfully', balance);
    } catch (error) {
      next(error);
    }
  };

  public listLowStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);

      const data = await this.inventoryService.listLowStock(tenantId, storeId, req.query);

      success(res, RESPONSE_MESSAGES.SUCCESS, data);
    } catch (error) {
      next(error);
    }
  };

  public recordStockIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;

      const balance = await this.inventoryService.mutateStock({
        tenantId,
        storeId,
        warehouseId: req.body.warehouseId,
        warehouseLocationId: req.body.warehouseLocationId,
        productId: req.body.productId,
        movementType: 'stock_in',
        direction: 'in',
        quantity: req.body.quantity,
        reason: req.body.reason,
        notes: req.body.notes,
        idempotencyKey: req.body.idempotencyKey,
        performedBy: userId,
      });

      await createAuditLog(
        {
          tenantId,
          action: 'STOCK_IN_RECORDED',
          entityType: 'inventory_balance',
          entityId: String(balance.id),
          newValues: balance.toJSON(),
        },
        req.context
      );

      success(res, 'Stock-in recorded successfully', balance);
    } catch (error) {
      next(error);
    }
  };

  public recordStockOut = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;

      const balance = await this.inventoryService.mutateStock({
        tenantId,
        storeId,
        warehouseId: req.body.warehouseId,
        warehouseLocationId: req.body.warehouseLocationId,
        productId: req.body.productId,
        movementType: 'stock_out',
        direction: 'out',
        quantity: req.body.quantity,
        reason: req.body.reason,
        notes: req.body.notes,
        idempotencyKey: req.body.idempotencyKey,
        performedBy: userId,
      });

      await createAuditLog(
        {
          tenantId,
          action: 'STOCK_OUT_RECORDED',
          entityType: 'inventory_balance',
          entityId: String(balance.id),
          newValues: balance.toJSON(),
        },
        req.context
      );

      success(res, 'Stock-out recorded successfully', balance);
    } catch (error) {
      next(error);
    }
  };

  public getMovement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const id = parseInt(req.params.id, 10);

      const movement = await this.movementService.getMovement(tenantId, storeId, id);

      success(res, RESPONSE_MESSAGES.SUCCESS, movement);
    } catch (error) {
      next(error);
    }
  };

  public listMovements = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);

      const movements = await this.movementService.listMovements(tenantId, storeId, req.query);

      success(res, RESPONSE_MESSAGES.SUCCESS, movements);
    } catch (error) {
      next(error);
    }
  };
}
