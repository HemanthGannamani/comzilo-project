import { Request, Response, NextFunction } from 'express';
import { CustomerAddressService } from '../services/customerAddress.service';
import { success, created } from '../shared/responses';
import { ValidationError } from '../shared/errors/AppError';

export class CustomerAddressController {
  private addressService = new CustomerAddressService();

  private getStoreId(req: Request): number {
    const storeId = Number(req.headers['x-store-id'] || req.query.storeId || req.body.storeId);
    if (!storeId || isNaN(storeId)) {
      throw new ValidationError('Store context is missing');
    }
    return storeId;
  }

  public createAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const customerId = Number(req.params.id);
      const userId = req.context!.authenticatedUserId!;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];

      const address = await this.addressService.createAddress(
        tenantId,
        storeId,
        customerId,
        userId,
        req.body,
        ip,
        userAgent
      );
      created(res, 'Address created successfully', address);
    } catch (error) {
      next(error);
    }
  };

  public listAddresses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const customerId = Number(req.params.id);

      const addresses = await this.addressService.listAddresses(tenantId, storeId, customerId);
      success(res, 'Addresses listed successfully', addresses);
    } catch (error) {
      next(error);
    }
  };

  public updateAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const id = Number(req.params.id);
      const userId = req.context!.authenticatedUserId!;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];

      const address = await this.addressService.updateAddress(
        tenantId,
        storeId,
        id,
        userId,
        req.body,
        ip,
        userAgent
      );
      success(res, 'Address updated successfully', address);
    } catch (error) {
      next(error);
    }
  };

  public deleteAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const id = Number(req.params.id);
      const userId = req.context!.authenticatedUserId!;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];

      await this.addressService.deleteAddress(tenantId, storeId, id, userId, ip, userAgent);
      success(res, 'Address deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  public restoreAddress = async (
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

      const address = await this.addressService.restoreAddress(
        tenantId,
        storeId,
        id,
        userId,
        ip,
        userAgent
      );
      success(res, 'Address restored successfully', address);
    } catch (error) {
      next(error);
    }
  };

  public setDefaultBilling = async (
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

      const address = await this.addressService.setDefaultBilling(
        tenantId,
        storeId,
        id,
        userId,
        ip,
        userAgent
      );
      success(res, 'Default billing address set successfully', address);
    } catch (error) {
      next(error);
    }
  };

  public setDefaultShipping = async (
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

      const address = await this.addressService.setDefaultShipping(
        tenantId,
        storeId,
        id,
        userId,
        ip,
        userAgent
      );
      success(res, 'Default shipping address set successfully', address);
    } catch (error) {
      next(error);
    }
  };
}
