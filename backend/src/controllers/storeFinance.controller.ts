/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StoreFinanceService } from '../services/storeFinance.service';
import { success, badRequest, created } from '../shared/responses';
import { logger } from '../shared/logging/logger';

export class StoreFinanceController {
  // CHART OF ACCOUNTS
  static async getAccounts(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const accounts = await StoreFinanceService.getAccounts(tenantId, storeId);
      success(res, 'Chart of accounts retrieved successfully', accounts);
    } catch (error: unknown) {
      const err = error as Error;
      logger.error(`[StoreFinanceController] getAccounts error: ${err.message}`);
      badRequest(res, err.message);
    }
  }

  static async createAccount(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const account = await StoreFinanceService.createAccount(tenantId, storeId, userId, req.body);
      created(res, 'Account created successfully in Chart of Accounts', account);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // DOUBLE-ENTRY JOURNAL & GENERAL LEDGER
  static async postJournalEntry(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const entry = await StoreFinanceService.postJournalEntry(tenantId, storeId, userId, req.body);
      created(res, 'Double-entry journal posted successfully to General Ledger', entry);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async getGeneralLedger(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const accountId = req.query.accountId
        ? parseInt(req.query.accountId as string, 10)
        : undefined;

      const ledger = await StoreFinanceService.getGeneralLedger(tenantId, storeId, accountId);
      success(res, 'General Ledger entries retrieved successfully', ledger);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // PAYABLES & RECEIVABLES
  static async getVendorBills(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const bills = await StoreFinanceService.getVendorBills(tenantId, storeId);
      success(res, 'Accounts Payable vendor bills retrieved successfully', bills);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createVendorBill(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const bill = await StoreFinanceService.createVendorBill(tenantId, storeId, userId, req.body);
      created(res, 'Vendor bill logged successfully', bill);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async getCustomerInvoices(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const invoices = await StoreFinanceService.getCustomerInvoices(tenantId, storeId);
      success(res, 'Accounts Receivable customer invoices retrieved successfully', invoices);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createCustomerInvoice(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const invoice = await StoreFinanceService.createCustomerInvoice(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Customer invoice created successfully', invoice);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // BANKING & RECONCILIATIONS
  static async getBankAccounts(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const banks = await StoreFinanceService.getBankAccounts(tenantId, storeId);
      success(res, 'Bank accounts retrieved successfully', banks);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createBankAccount(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const bank = await StoreFinanceService.createBankAccount(tenantId, storeId, userId, req.body);
      created(res, 'Bank account created successfully', bank);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async reconcileBankAccount(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const reconciliation = await StoreFinanceService.reconcileBankAccount(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Bank account reconciled successfully', reconciliation);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // FINANCIAL STATEMENTS
  static async getFinancialStatements(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const statements = await StoreFinanceService.getFinancialStatements(tenantId, storeId);
      success(res, 'Financial statements generated successfully', statements);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }
}
