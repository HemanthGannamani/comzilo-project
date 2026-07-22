import { Request, Response, NextFunction } from 'express';
import { ReceiptService } from '../services/receipt.service';
import { success } from '../shared/responses';
import { ValidationError } from '../shared/errors/AppError';

export class ReceiptController {
  private receiptService = new ReceiptService();

  private getStoreId(req: Request): number {
    const storeId = Number(req.headers['x-store-id'] || req.query.storeId || req.body.storeId);
    if (!storeId || isNaN(storeId)) {
      throw new ValidationError('Store context is missing');
    }
    return storeId;
  }

  public getReceipt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const id = Number(req.params.id);

      const receipt = await this.receiptService.getReceipt(tenantId, storeId, id);
      success(res, 'Receipt retrieved successfully', receipt);
    } catch (error) {
      next(error);
    }
  };

  public listReceipts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);

      const result = await this.receiptService.listReceipts(tenantId, storeId, req.query);
      success(res, 'Receipts listed successfully', result);
    } catch (error) {
      next(error);
    }
  };
}
