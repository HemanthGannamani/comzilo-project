/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StoreCrmService } from '../services/storeCrm.service';
import { success, badRequest, created } from '../shared/responses';
import { logger } from '../shared/logging/logger';

export class StoreCrmController {
  // CUSTOMERS & SEGMENTS
  static async getCustomers(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const result = await StoreCrmService.getCustomers(tenantId, storeId, req.query);
      success(res, 'Customers retrieved successfully', result);
    } catch (error: unknown) {
      const err = error as Error;
      logger.error(`[StoreCrmController] getCustomers error: ${err.message}`);
      badRequest(res, err.message);
    }
  }

  static async getSegments(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const segments = await StoreCrmService.getSegments(tenantId, storeId);
      success(res, 'Customer segments retrieved successfully', segments);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createSegment(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const segment = await StoreCrmService.createSegment(tenantId, storeId, userId, req.body);
      created(res, 'Customer segment created successfully', segment);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // WISHLISTS
  static async getWishlists(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const customerId = parseInt((req.query.customerId as string) || '1', 10);

      const wishlists = await StoreCrmService.getWishlists(tenantId, storeId, customerId);
      success(res, 'Wishlists retrieved successfully', wishlists);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createWishlist(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const wishlist = await StoreCrmService.createWishlist(tenantId, storeId, userId, req.body);
      created(res, 'Wishlist created successfully', wishlist);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // LOYALTY & REWARDS
  static async getLoyaltyAccount(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const customerId = parseInt((req.query.customerId as string) || '1', 10);

      const account = await StoreCrmService.getLoyaltyAccount(tenantId, storeId, customerId);
      success(res, 'Loyalty account retrieved successfully', account);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async transactRewardPoints(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const result = await StoreCrmService.transactRewardPoints(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Reward points transaction completed successfully', result);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // SUPPORT TICKETS & REPLIES
  static async getTickets(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const result = await StoreCrmService.getTickets(tenantId, storeId, req.query);
      success(res, 'Support tickets retrieved successfully', result);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createTicket(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const ticket = await StoreCrmService.createTicket(tenantId, storeId, userId, req.body);
      created(res, 'Support ticket created successfully', ticket);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async replyTicket(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;
      const ticketId = parseInt(req.params.id, 10);

      const reply = await StoreCrmService.replyTicket(
        tenantId,
        storeId,
        userId,
        ticketId,
        req.body
      );
      created(res, 'Support ticket reply posted successfully', reply);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // COMMUNICATION LOGS
  static async logCommunication(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const log = await StoreCrmService.logCommunication(tenantId, storeId, userId, req.body);
      created(res, 'Customer communication logged successfully', log);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }
}
