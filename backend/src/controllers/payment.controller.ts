import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import { success, created } from '../shared/responses';
import { ValidationError } from '../shared/errors/AppError';

export class PaymentController {
  private paymentService = new PaymentService();

  private getStoreId(req: Request): number {
    const storeId = Number(req.headers['x-store-id'] || req.query.storeId || req.body.storeId);
    if (!storeId || isNaN(storeId)) {
      throw new ValidationError('Store context is missing');
    }
    return storeId;
  }

  public createPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];

      const payment = await this.paymentService.createPayment(
        tenantId,
        storeId,
        userId,
        req.body,
        ip,
        userAgent
      );
      created(res, 'Payment created successfully', payment);
    } catch (error) {
      next(error);
    }
  };

  public getPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const id = Number(req.params.id);

      const payment = await this.paymentService.getPayment(tenantId, storeId, id);
      success(res, 'Payment retrieved successfully', payment);
    } catch (error) {
      next(error);
    }
  };

  public listPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);

      const result = await this.paymentService.listPayments(tenantId, storeId, req.query);
      success(res, 'Payments listed successfully', result);
    } catch (error) {
      next(error);
    }
  };

  public authorizePayment = async (
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

      const payment = await this.paymentService.authorizePayment(
        tenantId,
        storeId,
        id,
        userId,
        ip,
        userAgent
      );
      success(res, 'Payment authorized successfully', payment);
    } catch (error) {
      next(error);
    }
  };

  public capturePayment = async (
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

      const payment = await this.paymentService.capturePayment(
        tenantId,
        storeId,
        id,
        userId,
        ip,
        userAgent
      );
      success(res, 'Payment captured successfully', payment);
    } catch (error) {
      next(error);
    }
  };

  public failPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const id = Number(req.params.id);
      const userId = req.context!.authenticatedUserId!;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];

      const payment = await this.paymentService.failPayment(
        tenantId,
        storeId,
        id,
        userId,
        ip,
        userAgent
      );
      success(res, 'Payment marked as failed successfully', payment);
    } catch (error) {
      next(error);
    }
  };

  public cancelPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const id = Number(req.params.id);
      const userId = req.context!.authenticatedUserId!;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];

      const payment = await this.paymentService.cancelPayment(
        tenantId,
        storeId,
        id,
        userId,
        ip,
        userAgent
      );
      success(res, 'Payment cancelled successfully', payment);
    } catch (error) {
      next(error);
    }
  };

  public refundPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const paymentId = Number(req.params.id);
      const userId = req.context!.authenticatedUserId!;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];

      const refund = await this.paymentService.refundPayment(
        tenantId,
        storeId,
        paymentId,
        userId,
        req.body,
        ip,
        userAgent
      );
      success(res, 'Refund processed successfully', refund);
    } catch (error) {
      next(error);
    }
  };

  public getRefund = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const id = Number(req.params.id);

      const refund = await this.paymentService.getRefund(tenantId, storeId, id);
      success(res, 'Refund retrieved successfully', refund);
    } catch (error) {
      next(error);
    }
  };

  public listRefunds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);

      const result = await this.paymentService.listRefunds(tenantId, storeId, req.query);
      success(res, 'Refunds listed successfully', result);
    } catch (error) {
      next(error);
    }
  };
}
