/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StorePaymentService } from '../services/storePayment.service';
import { success, badRequest, created } from '../shared/responses';
import { logger } from '../shared/logging/logger';

export class StorePaymentController {
  // GATEWAYS
  static async getGateways(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const gateways = await StorePaymentService.getGateways(tenantId, storeId);
      success(res, 'Payment gateways retrieved successfully', gateways);
    } catch (error: unknown) {
      const err = error as Error;
      logger.error(`[StorePaymentController] getGateways error: ${err.message}`);
      badRequest(res, err.message);
    }
  }

  static async createGateway(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const gateway = await StorePaymentService.createGateway(tenantId, storeId, userId, req.body);
      created(res, 'Payment gateway configured successfully', gateway);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // TRANSACTIONS & RETRY ATTEMPTS
  static async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const result = await StorePaymentService.getTransactions(tenantId, storeId, req.query);
      success(res, 'Transactions retrieved successfully', result);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async recordAttempt(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const attempt = await StorePaymentService.recordAttempt(tenantId, storeId, userId, req.body);
      created(res, 'Transaction attempt recorded successfully', attempt);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // SETTLEMENTS & RECONCILIATION
  static async getSettlements(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const settlements = await StorePaymentService.getSettlements(tenantId, storeId, req.query);
      success(res, 'Settlements retrieved successfully', settlements);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createSettlement(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const settlement = await StorePaymentService.createSettlement(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Settlement recorded successfully', settlement);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async runReconciliation(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const reconciliation = await StorePaymentService.runReconciliation(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Reconciliation executed successfully', reconciliation);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // CREDIT NOTES & WALLET
  static async createCreditNote(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const creditNote = await StorePaymentService.createCreditNote(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Credit note issued successfully', creditNote);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async getWalletTransactions(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const customerId = parseInt((req.query.customerId as string) || '1', 10);

      const walletTxns = await StorePaymentService.getWalletTransactions(
        tenantId,
        storeId,
        customerId
      );
      success(res, 'Wallet transactions retrieved successfully', walletTxns);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async transactWallet(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const walletTxn = await StorePaymentService.transactWallet(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Wallet transaction processed successfully', walletTxn);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }
}
