/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StoreInventoryService } from '../services/storeInventory.service';
import { success, badRequest, created } from '../shared/responses';
import { logger } from '../shared/logging/logger';

export class StoreInventoryController {
  // WAREHOUSES & LOCATIONS
  static async getWarehouses(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const warehouses = await StoreInventoryService.getWarehouses(tenantId, storeId);
      success(res, 'Warehouses retrieved successfully', warehouses);
    } catch (error: unknown) {
      const err = error as Error;
      logger.error(`[StoreInventoryController] getWarehouses error: ${err.message}`);
      badRequest(res, err.message);
    }
  }

  static async createWarehouse(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const warehouse = await StoreInventoryService.createWarehouse(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Warehouse created successfully', warehouse);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createLocation(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const warehouseId = parseInt(req.params.warehouseId, 10);
      const location = await StoreInventoryService.createLocation(
        tenantId,
        storeId,
        warehouseId,
        req.body
      );
      created(res, 'Location created successfully', location);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // INVENTORY ITEMS
  static async getInventoryItems(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const result = await StoreInventoryService.getInventoryItems(tenantId, storeId, req.query);
      success(res, 'Inventory items retrieved successfully', result);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async updateStock(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const item = await StoreInventoryService.updateStock(tenantId, storeId, userId, req.body);
      success(res, 'Stock updated successfully', item);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // MOVEMENTS
  static async getMovements(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const movements = await StoreInventoryService.getMovements(tenantId, storeId, req.query);
      success(res, 'Movements ledger retrieved successfully', movements);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // TRANSFERS
  static async getTransfers(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const transfers = await StoreInventoryService.getTransfers(tenantId, storeId, req.query);
      success(res, 'Transfers retrieved successfully', transfers);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createTransfer(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const transfer = await StoreInventoryService.createTransfer(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Transfer created successfully', transfer);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async updateTransferStatus(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;

      const updated = await StoreInventoryService.updateTransferStatus(
        tenantId,
        storeId,
        userId,
        id,
        status
      );
      success(res, 'Transfer status updated successfully', updated);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // RESERVATIONS
  static async createReservation(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const reservation = await StoreInventoryService.createReservation(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Reservation created successfully', reservation);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // BATCHES & SERIALS
  static async createBatch(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const batch = await StoreInventoryService.createBatch(tenantId, storeId, userId, req.body);
      created(res, 'Batch created successfully', batch);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createSerial(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const serial = await StoreInventoryService.createSerial(tenantId, storeId, userId, req.body);
      created(res, 'Serial created successfully', serial);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // CYCLE COUNTING
  static async createCycleCount(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const count = await StoreInventoryService.createCycleCount(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Cycle count created successfully', count);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }
}
