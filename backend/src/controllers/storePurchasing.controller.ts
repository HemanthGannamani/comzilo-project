/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StorePurchasingService } from '../services/storePurchasing.service';
import { success, badRequest, created } from '../shared/responses';
import { logger } from '../shared/logging/logger';

export class StorePurchasingController {
  // SUPPLIERS
  static async getSuppliers(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const suppliers = await StorePurchasingService.getSuppliers(tenantId, storeId);
      success(res, 'Suppliers retrieved successfully', suppliers);
    } catch (error: unknown) {
      const err = error as Error;
      logger.error(`[StorePurchasingController] getSuppliers error: ${err.message}`);
      badRequest(res, err.message);
    }
  }

  static async createSupplier(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const supplier = await StorePurchasingService.createSupplier(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Supplier registered successfully', supplier);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // PURCHASE REQUESTS
  static async getRequests(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const requests = await StorePurchasingService.getRequests(tenantId, storeId);
      success(res, 'Purchase requests retrieved successfully', requests);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createRequest(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const request = await StorePurchasingService.createRequest(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Purchase request submitted successfully', request);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // PURCHASE ORDERS
  static async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const orders = await StorePurchasingService.getOrders(tenantId, storeId);
      success(res, 'Purchase orders retrieved successfully', orders);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const order = await StorePurchasingService.createOrder(tenantId, storeId, userId, req.body);
      created(res, 'Purchase order issued successfully', order);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // GOODS RECEIPT NOTES (GRN)
  static async getGoodsReceipts(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const receipts = await StorePurchasingService.getGoodsReceipts(tenantId, storeId);
      success(res, 'Goods receipt notes retrieved successfully', receipts);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createGoodsReceipt(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const grn = await StorePurchasingService.createGoodsReceipt(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Goods Receipt Note (GRN) created & inventory updated', grn);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // SUPPLIER RETURNS
  static async processReturn(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const supplierReturn = await StorePurchasingService.processReturn(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Supplier return processed successfully', supplierReturn);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // INVOICES & PAYMENTS
  static async getInvoices(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const invoices = await StorePurchasingService.getInvoices(tenantId, storeId);
      success(res, 'Purchase invoices retrieved successfully', invoices);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createInvoice(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const invoice = await StorePurchasingService.createInvoice(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Purchase invoice logged successfully', invoice);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async payInvoice(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const payment = await StorePurchasingService.payInvoice(tenantId, storeId, userId, req.body);
      created(res, 'Supplier payment disbursed successfully', payment);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }
}
