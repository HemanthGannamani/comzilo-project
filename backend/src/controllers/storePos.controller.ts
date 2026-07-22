/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StorePosService } from '../services/storePos.service';
import { success, badRequest, created } from '../shared/responses';
import { logger } from '../shared/logging/logger';

export class StorePosController {
  // REGISTERS & SESSIONS
  static async getRegisters(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const registers = await StorePosService.getRegisters(tenantId, storeId);
      success(res, 'POS registers retrieved successfully', registers);
    } catch (error: unknown) {
      const err = error as Error;
      logger.error(`[StorePosController] getRegisters error: ${err.message}`);
      badRequest(res, err.message);
    }
  }

  static async createRegister(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const register = await StorePosService.createRegister(tenantId, storeId, userId, req.body);
      created(res, 'POS register created successfully', register);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async openSession(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const session = await StorePosService.openSession(tenantId, storeId, userId, req.body);
      created(res, 'POS register session opened successfully', session);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async closeSession(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const session = await StorePosService.closeSession(tenantId, storeId, userId, req.body);
      success(res, 'POS register session closed and reconciled successfully', session);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async addCashMovement(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const movement = await StorePosService.addCashMovement(tenantId, storeId, userId, req.body);
      created(res, 'Cash movement recorded successfully', movement);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // CHECKOUT & SPLIT PAYMENTS
  static async processSale(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const sale = await StorePosService.processSale(tenantId, storeId, userId, req.body);
      created(res, 'POS sale processed successfully', sale);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // RETURNS & REFUNDS
  static async processReturn(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const posReturn = await StorePosService.processReturn(tenantId, storeId, userId, req.body);
      created(res, 'POS return processed successfully', posReturn);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // OFFLINE SYNC QUEUE
  static async syncOfflineQueue(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const payloads = req.body.payloads || [req.body];
      const results = await StorePosService.syncOfflineQueue(tenantId, storeId, userId, payloads);
      created(res, 'Offline POS transactions synced successfully', results);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }
}
