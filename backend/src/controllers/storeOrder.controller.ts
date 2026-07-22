/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StoreOrderService } from '../services/storeOrder.service';
import { success, badRequest, notFound, created } from '../shared/responses';
import { logger } from '../shared/logging/logger';

export class StoreOrderController {
  // ORDERS LIST & DETAILS
  static async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const result = await StoreOrderService.getOrders(tenantId, storeId, req.query);
      success(res, 'Orders retrieved successfully', result);
    } catch (error: unknown) {
      const err = error as Error;
      logger.error(`[StoreOrderController] getOrders error: ${err.message}`);
      badRequest(res, err.message);
    }
  }

  static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const id = parseInt(req.params.id, 10);

      const order = await StoreOrderService.getOrderById(tenantId, storeId, id);
      success(res, 'Order details retrieved successfully', order);
    } catch (error: unknown) {
      const err = error as Error;
      notFound(res, err.message);
    }
  }

  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const order = await StoreOrderService.createOrder(tenantId, storeId, userId, req.body);
      created(res, 'Order created successfully', order);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;
      const id = parseInt(req.params.id, 10);
      const { status, comment } = req.body;

      const updated = await StoreOrderService.updateOrderStatus(
        tenantId,
        storeId,
        userId,
        id,
        status,
        comment
      );
      success(res, 'Order status updated successfully', updated);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // PAYMENTS
  static async recordPayment(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;
      const orderId = parseInt(req.params.id, 10);

      const payment = await StoreOrderService.recordPayment(
        tenantId,
        storeId,
        userId,
        orderId,
        req.body
      );
      created(res, 'Payment recorded successfully', payment);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // INVOICES
  static async generateInvoice(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;
      const orderId = parseInt(req.params.id, 10);

      const invoice = await StoreOrderService.generateInvoice(
        tenantId,
        storeId,
        userId,
        orderId,
        req.body
      );
      created(res, 'Invoice generated successfully', invoice);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // SHIPMENTS
  static async createShipment(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;
      const orderId = parseInt(req.params.id, 10);

      const shipment = await StoreOrderService.createShipment(
        tenantId,
        storeId,
        userId,
        orderId,
        req.body
      );
      created(res, 'Shipment created successfully', shipment);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // RETURNS & REFUNDS
  static async requestReturn(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;
      const orderId = parseInt(req.params.id, 10);

      const ret = await StoreOrderService.requestReturn(
        tenantId,
        storeId,
        userId,
        orderId,
        req.body
      );
      created(res, 'Return requested successfully', ret);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async issueRefund(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;
      const orderId = parseInt(req.params.id, 10);

      const refund = await StoreOrderService.issueRefund(
        tenantId,
        storeId,
        userId,
        orderId,
        req.body
      );
      created(res, 'Refund issued successfully', refund);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }
}
