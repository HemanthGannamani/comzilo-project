import { Request, Response, NextFunction } from 'express';
import { StockAdjustmentService } from '../services/stockAdjustment.service';
import { createAuditLog } from '../utils/auditHelper';
import { success, created } from '../shared/responses';
import { ValidationError } from '../shared/errors/AppError';
import { RESPONSE_MESSAGES } from '../shared/constants';

export class StockAdjustmentController {
  private adjustmentService: StockAdjustmentService;

  constructor() {
    this.adjustmentService = new StockAdjustmentService();
  }

  private getStoreId(req: Request): number {
    const storeId = Number(req.headers['x-store-id'] || req.query.storeId || req.body.storeId);
    if (!storeId || isNaN(storeId)) {
      throw new ValidationError('Store context is missing');
    }
    return storeId;
  }

  public createAdjustment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;

      const adjustment = await this.adjustmentService.createAdjustment(
        tenantId,
        storeId,
        userId,
        req.body
      );

      await createAuditLog(
        {
          tenantId,
          action: 'STOCK_ADJUSTMENT_CREATED',
          entityType: 'stock_adjustment',
          entityId: String(adjustment.id),
          newValues: adjustment.toJSON(),
        },
        req.context
      );

      created(res, 'Stock adjustment request created successfully', adjustment);
    } catch (error) {
      next(error);
    }
  };

  public getAdjustment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const id = parseInt(req.params.id, 10);

      const adjustment = await this.adjustmentService.getAdjustment(tenantId, storeId, id);

      success(res, RESPONSE_MESSAGES.SUCCESS, adjustment);
    } catch (error) {
      next(error);
    }
  };

  public listAdjustments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);

      const adjustments = await this.adjustmentService.listAdjustments(
        tenantId,
        storeId,
        req.query
      );

      success(res, RESPONSE_MESSAGES.SUCCESS, adjustments);
    } catch (error) {
      next(error);
    }
  };

  public approveAdjustment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const id = parseInt(req.params.id, 10);

      const oldAdj = await this.adjustmentService.getAdjustment(tenantId, storeId, id);
      const adjustment = await this.adjustmentService.approveAdjustment(
        tenantId,
        storeId,
        id,
        userId
      );

      await createAuditLog(
        {
          tenantId,
          action: 'STOCK_ADJUSTMENT_APPROVED',
          entityType: 'stock_adjustment',
          entityId: String(adjustment.id),
          previousValues: oldAdj.toJSON(),
          newValues: adjustment.toJSON(),
        },
        req.context
      );

      success(res, 'Stock adjustment approved and applied successfully', adjustment);
    } catch (error) {
      next(error);
    }
  };

  public rejectAdjustment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const id = parseInt(req.params.id, 10);

      const oldAdj = await this.adjustmentService.getAdjustment(tenantId, storeId, id);
      const adjustment = await this.adjustmentService.rejectAdjustment(
        tenantId,
        storeId,
        id,
        userId
      );

      await createAuditLog(
        {
          tenantId,
          action: 'STOCK_ADJUSTMENT_REJECTED',
          entityType: 'stock_adjustment',
          entityId: String(adjustment.id),
          previousValues: oldAdj.toJSON(),
          newValues: adjustment.toJSON(),
        },
        req.context
      );

      success(res, 'Stock adjustment request rejected successfully', adjustment);
    } catch (error) {
      next(error);
    }
  };

  public cancelAdjustment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const id = parseInt(req.params.id, 10);

      const oldAdj = await this.adjustmentService.getAdjustment(tenantId, storeId, id);
      const adjustment = await this.adjustmentService.cancelAdjustment(
        tenantId,
        storeId,
        id,
        userId
      );

      await createAuditLog(
        {
          tenantId,
          action: 'STOCK_ADJUSTMENT_CANCELLED',
          entityType: 'stock_adjustment',
          entityId: String(adjustment.id),
          previousValues: oldAdj.toJSON(),
          newValues: adjustment.toJSON(),
        },
        req.context
      );

      success(res, 'Stock adjustment request cancelled successfully', adjustment);
    } catch (error) {
      next(error);
    }
  };
}
