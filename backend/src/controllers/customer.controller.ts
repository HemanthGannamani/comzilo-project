import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customer.service';
import { success, created } from '../shared/responses';
import { ValidationError } from '../shared/errors/AppError';

export class CustomerController {
  private customerService = new CustomerService();

  private getStoreId(req: Request): number {
    const storeId = Number(
      req.headers['x-store-id'] || req.query.storeId || req.body.storeId || req.context?.storeId
    );
    if (!storeId || isNaN(storeId)) {
      throw new ValidationError('Store context is required');
    }
    return storeId;
  }

  public createCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];

      const customer = await this.customerService.createCustomer(
        tenantId,
        storeId,
        userId,
        req.body,
        ip,
        userAgent
      );

      created(res, 'Customer created successfully', customer);
    } catch (error) {
      next(error);
    }
  };

  public getCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const id = Number(req.params.id);

      const customer = await this.customerService.getCustomer(tenantId, storeId, id);
      success(res, 'Customer retrieved successfully', customer);
    } catch (error) {
      next(error);
    }
  };

  public listCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);

      const result = await this.customerService.listCustomers(tenantId, storeId, req.query);
      success(res, 'Customers listed successfully', result);
    } catch (error) {
      next(error);
    }
  };

  public updateCustomer = async (
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

      const customer = await this.customerService.updateCustomer(
        tenantId,
        storeId,
        id,
        userId,
        req.body,
        ip,
        userAgent
      );
      success(res, 'Customer updated successfully', customer);
    } catch (error) {
      next(error);
    }
  };

  public blockCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const id = Number(req.params.id);
      const userId = req.context!.authenticatedUserId!;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];

      const customer = await this.customerService.blockCustomer(
        tenantId,
        storeId,
        id,
        userId,
        ip,
        userAgent
      );
      success(res, 'Customer blocked successfully', customer);
    } catch (error) {
      next(error);
    }
  };

  public unblockCustomer = async (
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

      const customer = await this.customerService.unblockCustomer(
        tenantId,
        storeId,
        id,
        userId,
        ip,
        userAgent
      );
      success(res, 'Customer unblocked successfully', customer);
    } catch (error) {
      next(error);
    }
  };

  public deactivateCustomer = async (
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

      const customer = await this.customerService.deactivateCustomer(
        tenantId,
        storeId,
        id,
        userId,
        ip,
        userAgent
      );
      success(res, 'Customer deactivated successfully', customer);
    } catch (error) {
      next(error);
    }
  };

  public activateCustomer = async (
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

      const customer = await this.customerService.activateCustomer(
        tenantId,
        storeId,
        id,
        userId,
        ip,
        userAgent
      );
      success(res, 'Customer activated successfully', customer);
    } catch (error) {
      next(error);
    }
  };

  public deleteCustomer = async (
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

      await this.customerService.deleteCustomer(tenantId, storeId, id, userId, ip, userAgent);
      success(res, 'Customer deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  public restoreCustomer = async (
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

      const customer = await this.customerService.restoreCustomer(
        tenantId,
        storeId,
        id,
        userId,
        ip,
        userAgent
      );
      success(res, 'Customer restored successfully', customer);
    } catch (error) {
      next(error);
    }
  };
}
