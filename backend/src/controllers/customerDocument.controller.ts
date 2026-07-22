import { Request, Response, NextFunction } from 'express';
import { CustomerDocumentService } from '../services/customerDocument.service';
import { success, created } from '../shared/responses';
import { ValidationError } from '../shared/errors/AppError';

export class CustomerDocumentController {
  private documentService = new CustomerDocumentService();

  private getStoreId(req: Request): number {
    const storeId = Number(req.headers['x-store-id'] || req.query.storeId || req.body.storeId);
    if (!storeId || isNaN(storeId)) {
      throw new ValidationError('Store context is missing');
    }
    return storeId;
  }

  public uploadDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const customerId = Number(req.params.id);
      const userId = req.context!.authenticatedUserId!;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];

      const doc = await this.documentService.uploadDocument(
        tenantId,
        storeId,
        customerId,
        userId,
        req.body,
        ip,
        userAgent
      );
      created(res, 'Customer document uploaded successfully', doc);
    } catch (error) {
      next(error);
    }
  };

  public removeDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const id = Number(req.params.id);
      const userId = req.context!.authenticatedUserId!;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];

      await this.documentService.removeDocument(tenantId, storeId, id, userId, ip, userAgent);
      success(res, 'Customer document removed successfully');
    } catch (error) {
      next(error);
    }
  };

  public listDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const customerId = Number(req.params.id);

      const docs = await this.documentService.listDocuments(tenantId, storeId, customerId);
      success(res, 'Customer documents listed successfully', docs);
    } catch (error) {
      next(error);
    }
  };
}
