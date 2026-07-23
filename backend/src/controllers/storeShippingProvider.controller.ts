import { Request, Response, NextFunction } from 'express';
import { ShippingProviderService } from '../services/shippingProvider.service';
import { success, created } from '../shared/responses';

const shippingService = new ShippingProviderService();

export class StoreShippingProviderController {
  public getProviders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const providers = await shippingService.getTenantProviders(tenantId);
      success(res, 'Tenant shipping providers retrieved successfully', providers);
    } catch (error) {
      next(error);
    }
  };

  public configureProvider = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const { providerId } = req.params;
      const config = await shippingService.configureTenantProvider(tenantId, Number(providerId), req.body);
      success(res, 'Shipping provider configured successfully', config);
    } catch (error) {
      next(error);
    }
  };

  public testConnection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const { providerCode } = req.body;
      const result = await shippingService.testProviderConnection(tenantId, providerCode);
      success(res, result.message, result);
    } catch (error) {
      next(error);
    }
  };

  public getZones = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const zones = await shippingService.getZones(tenantId);
      success(res, 'Shipping zones retrieved successfully', zones);
    } catch (error) {
      next(error);
    }
  };

  public createZone = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const zone = await shippingService.createZone(tenantId, req.body);
      created(res, 'Shipping zone created successfully', zone);
    } catch (error) {
      next(error);
    }
  };

  public getMethods = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const methods = await shippingService.getMethods(tenantId);
      success(res, 'Shipping methods retrieved successfully', methods);
    } catch (error) {
      next(error);
    }
  };

  public createMethod = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const method = await shippingService.createMethod(tenantId, req.body);
      created(res, 'Shipping method created successfully', method);
    } catch (error) {
      next(error);
    }
  };

  public getPickupAddresses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const addresses = await shippingService.getPickupAddresses(tenantId);
      success(res, 'Pickup addresses retrieved successfully', addresses);
    } catch (error) {
      next(error);
    }
  };

  public createPickupAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const address = await shippingService.createPickupAddress(tenantId, req.body);
      created(res, 'Pickup address created successfully', address);
    } catch (error) {
      next(error);
    }
  };

  public getPackages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const packages = await shippingService.getPackages(tenantId);
      success(res, 'Shipment packages retrieved successfully', packages);
    } catch (error) {
      next(error);
    }
  };

  public createPackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const pkg = await shippingService.createPackage(tenantId, req.body);
      created(res, 'Shipment package created successfully', pkg);
    } catch (error) {
      next(error);
    }
  };

  public calculateRate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const rateInfo = await shippingService.calculateShippingRate(tenantId, req.body);
      success(res, 'Shipping rate calculated successfully', rateInfo);
    } catch (error) {
      next(error);
    }
  };

  public createShipment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const shipment = await shippingService.createShipment(tenantId, req.body);
      created(res, 'Shipment created successfully', shipment);
    } catch (error) {
      next(error);
    }
  };

  public getShipments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const shipments = await shippingService.getShipments(tenantId);
      success(res, 'Shipments retrieved successfully', shipments);
    } catch (error) {
      next(error);
    }
  };

  public getLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const logs = await shippingService.getShippingLogs(tenantId);
      success(res, 'Shipping logs retrieved successfully', logs);
    } catch (error) {
      next(error);
    }
  };
}
