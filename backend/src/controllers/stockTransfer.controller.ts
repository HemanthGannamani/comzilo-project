import { Request, Response, NextFunction } from 'express';
import { StockTransferService } from '../services/stockTransfer.service';
import { createAuditLog } from '../utils/auditHelper';
import { success, created } from '../shared/responses';
import { ValidationError } from '../shared/errors/AppError';
import { RESPONSE_MESSAGES } from '../shared/constants';

export class StockTransferController {
  private transferService: StockTransferService;

  constructor() {
    this.transferService = new StockTransferService();
  }

  private getStoreId(req: Request): number {
    const storeId = Number(req.headers['x-store-id'] || req.query.storeId || req.body.storeId);
    if (!storeId || isNaN(storeId)) {
      throw new ValidationError('Store context is missing');
    }
    return storeId;
  }

  public createTransfer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;

      const transfer = await this.transferService.createTransfer(
        tenantId,
        storeId,
        userId,
        req.body
      );

      await createAuditLog(
        {
          tenantId,
          action: 'STOCK_TRANSFER_CREATED',
          entityType: 'stock_transfer',
          entityId: String(transfer.id),
          newValues: transfer.toJSON(),
        },
        req.context
      );

      created(res, 'Stock transfer created successfully', transfer);
    } catch (error) {
      next(error);
    }
  };

  public getTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const id = parseInt(req.params.id, 10);

      const transfer = await this.transferService.getTransfer(tenantId, storeId, id);

      success(res, RESPONSE_MESSAGES.SUCCESS, transfer);
    } catch (error) {
      next(error);
    }
  };

  public listTransfers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);

      const transfers = await this.transferService.listTransfers(tenantId, storeId, req.query);

      success(res, RESPONSE_MESSAGES.SUCCESS, transfers);
    } catch (error) {
      next(error);
    }
  };

  public updateTransfer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const id = parseInt(req.params.id, 10);

      const oldTransfer = await this.transferService.getTransfer(tenantId, storeId, id);
      const transfer = await this.transferService.updateTransfer(
        tenantId,
        storeId,
        id,
        userId,
        req.body
      );

      await createAuditLog(
        {
          tenantId,
          action: 'STOCK_TRANSFER_UPDATED',
          entityType: 'stock_transfer',
          entityId: String(transfer.id),
          previousValues: oldTransfer.toJSON(),
          newValues: transfer.toJSON(),
        },
        req.context
      );

      success(res, 'Stock transfer updated successfully', transfer);
    } catch (error) {
      next(error);
    }
  };

  public submitTransfer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const id = parseInt(req.params.id, 10);

      const oldTransfer = await this.transferService.getTransfer(tenantId, storeId, id);
      const transfer = await this.transferService.submitTransfer(tenantId, storeId, id);

      await createAuditLog(
        {
          tenantId,
          action: 'STOCK_TRANSFER_SUBMITTED',
          entityType: 'stock_transfer',
          entityId: String(transfer.id),
          previousValues: oldTransfer.toJSON(),
          newValues: transfer.toJSON(),
        },
        req.context
      );

      success(res, 'Stock transfer submitted successfully', transfer);
    } catch (error) {
      next(error);
    }
  };

  public approveTransfer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const id = parseInt(req.params.id, 10);

      const oldTransfer = await this.transferService.getTransfer(tenantId, storeId, id);
      const transfer = await this.transferService.approveTransfer(tenantId, storeId, id, userId);

      await createAuditLog(
        {
          tenantId,
          action: 'STOCK_TRANSFER_APPROVED',
          entityType: 'stock_transfer',
          entityId: String(transfer.id),
          previousValues: oldTransfer.toJSON(),
          newValues: transfer.toJSON(),
        },
        req.context
      );

      success(res, 'Stock transfer approved successfully', transfer);
    } catch (error) {
      next(error);
    }
  };

  public rejectTransfer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const id = parseInt(req.params.id, 10);

      const oldTransfer = await this.transferService.getTransfer(tenantId, storeId, id);
      const transfer = await this.transferService.rejectTransfer(tenantId, storeId, id, userId);

      await createAuditLog(
        {
          tenantId,
          action: 'STOCK_TRANSFER_REJECTED',
          entityType: 'stock_transfer',
          entityId: String(transfer.id),
          previousValues: oldTransfer.toJSON(),
          newValues: transfer.toJSON(),
        },
        req.context
      );

      success(res, 'Stock transfer rejected successfully', transfer);
    } catch (error) {
      next(error);
    }
  };

  public shipTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const id = parseInt(req.params.id, 10);

      const oldTransfer = await this.transferService.getTransfer(tenantId, storeId, id);
      const transfer = await this.transferService.shipTransfer(tenantId, storeId, id, userId);

      await createAuditLog(
        {
          tenantId,
          action: 'STOCK_TRANSFER_SHIPPED',
          entityType: 'stock_transfer',
          entityId: String(transfer.id),
          previousValues: oldTransfer.toJSON(),
          newValues: transfer.toJSON(),
        },
        req.context
      );

      success(res, 'Stock transfer shipped successfully', transfer);
    } catch (error) {
      next(error);
    }
  };

  public receiveTransfer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const id = parseInt(req.params.id, 10);

      const oldTransfer = await this.transferService.getTransfer(tenantId, storeId, id);
      const transfer = await this.transferService.receiveTransfer(
        tenantId,
        storeId,
        id,
        userId,
        req.body
      );

      await createAuditLog(
        {
          tenantId,
          action: 'STOCK_TRANSFER_RECEIVED',
          entityType: 'stock_transfer',
          entityId: String(transfer.id),
          previousValues: oldTransfer.toJSON(),
          newValues: transfer.toJSON(),
        },
        req.context
      );

      success(res, 'Stock transfer received successfully', transfer);
    } catch (error) {
      next(error);
    }
  };

  public cancelTransfer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const id = parseInt(req.params.id, 10);

      const oldTransfer = await this.transferService.getTransfer(tenantId, storeId, id);
      const transfer = await this.transferService.cancelTransfer(tenantId, storeId, id, userId);

      await createAuditLog(
        {
          tenantId,
          action: 'STOCK_TRANSFER_CANCELLED',
          entityType: 'stock_transfer',
          entityId: String(transfer.id),
          previousValues: oldTransfer.toJSON(),
          newValues: transfer.toJSON(),
        },
        req.context
      );

      success(res, 'Stock transfer cancelled successfully', transfer);
    } catch (error) {
      next(error);
    }
  };
}
