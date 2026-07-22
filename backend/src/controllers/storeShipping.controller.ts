/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StoreShippingService } from '../services/storeShipping.service';
import { success, badRequest, created } from '../shared/responses';
import { logger } from '../shared/logging/logger';

export class StoreShippingController {
  // ZONES & METHODS
  static async getZones(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const zones = await StoreShippingService.getZones(tenantId, storeId);
      success(res, 'Shipping zones retrieved successfully', zones);
    } catch (error: unknown) {
      const err = error as Error;
      logger.error(`[StoreShippingController] getZones error: ${err.message}`);
      badRequest(res, err.message);
    }
  }

  static async createZone(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const zone = await StoreShippingService.createZone(tenantId, storeId, userId, req.body);
      created(res, 'Shipping zone created successfully', zone);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createMethod(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const method = await StoreShippingService.createMethod(tenantId, storeId, userId, req.body);
      created(res, 'Shipping method created successfully', method);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // CARRIERS
  static async getCarriers(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const carriers = await StoreShippingService.getCarriers(tenantId, storeId);
      success(res, 'Shipping carriers retrieved successfully', carriers);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createCarrier(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const carrier = await StoreShippingService.createCarrier(tenantId, storeId, userId, req.body);
      created(res, 'Shipping carrier created successfully', carrier);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // SHIPMENTS & TRACKING
  static async getShipments(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const result = await StoreShippingService.getShipments(tenantId, storeId, req.query);
      success(res, 'Shipments retrieved successfully', result);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createShipment(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const shipment = await StoreShippingService.createShipment(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Shipment created successfully', shipment);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async updateShipmentStatus(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;
      const id = parseInt(req.params.id, 10);
      const { status, location, description } = req.body;

      const updated = await StoreShippingService.updateShipmentStatus(
        tenantId,
        storeId,
        userId,
        id,
        status,
        location,
        description
      );
      success(res, 'Shipment status updated successfully', updated);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // CARRIER PICKUPS
  static async schedulePickup(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const pickup = await StoreShippingService.schedulePickup(tenantId, storeId, userId, req.body);
      created(res, 'Carrier pickup scheduled successfully', pickup);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }
}
