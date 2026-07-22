import { Request, Response, NextFunction } from 'express';
import { POSService } from '../services/pos.service';
import { success, created } from '../shared/responses';
import { ValidationError } from '../shared/errors/AppError';

export class POSController {
  private posService = new POSService();

  private getStoreId(req: Request): number {
    const storeId = Number(req.headers['x-store-id'] || req.query.storeId || req.body.storeId);
    if (!storeId || isNaN(storeId)) {
      throw new ValidationError('Store context is missing');
    }
    return storeId;
  }

  public openRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const cashierId = req.context!.authenticatedUserId!;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];

      const session = await this.posService.openRegister(
        tenantId,
        storeId,
        cashierId,
        req.body,
        ip,
        userAgent
      );
      created(res, 'POS Register opened successfully', session);
    } catch (error) {
      next(error);
    }
  };

  public closeRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const cashierId = req.context!.authenticatedUserId!;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];

      const session = await this.posService.closeRegister(
        tenantId,
        storeId,
        cashierId,
        req.body,
        ip,
        userAgent
      );
      success(res, 'POS Register closed successfully', session);
    } catch (error) {
      next(error);
    }
  };

  public createPOSSale = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const cashierId = req.context!.authenticatedUserId!;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];

      const receipt = await this.posService.createPOSSale(
        tenantId,
        storeId,
        cashierId,
        req.body,
        ip,
        userAgent
      );
      created(res, 'POS sale processed successfully', receipt);
    } catch (error) {
      next(error);
    }
  };

  public createPOSReturn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const cashierId = req.context!.authenticatedUserId!;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];

      const result = await this.posService.createPOSReturn(
        tenantId,
        storeId,
        cashierId,
        req.body,
        ip,
        userAgent
      );
      success(res, 'POS return processed successfully', result);
    } catch (error) {
      next(error);
    }
  };

  public listRegisters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);

      const result = await this.posService.listRegisters(tenantId, storeId, req.query);
      success(res, 'POS Registers listed successfully', result);
    } catch (error) {
      next(error);
    }
  };

  public listSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);

      const result = await this.posService.listSessions(tenantId, storeId, req.query);
      success(res, 'POS Sessions listed successfully', result);
    } catch (error) {
      next(error);
    }
  };
}
