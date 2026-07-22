/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StoreMarketingService } from '../services/storeMarketing.service';
import { success, badRequest, created } from '../shared/responses';
import { logger } from '../shared/logging/logger';

export class StoreMarketingController {
  // PROMOTIONS
  static async getPromotions(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const promotions = await StoreMarketingService.getPromotions(tenantId, storeId);
      success(res, 'Promotions retrieved successfully', promotions);
    } catch (error: unknown) {
      const err = error as Error;
      logger.error(`[StoreMarketingController] getPromotions error: ${err.message}`);
      badRequest(res, err.message);
    }
  }

  static async createPromotion(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const promotion = await StoreMarketingService.createPromotion(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Promotion created successfully', promotion);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // COUPONS & REDEMPTIONS
  static async getCoupons(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const coupons = await StoreMarketingService.getCoupons(tenantId, storeId);
      success(res, 'Coupons retrieved successfully', coupons);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createCoupon(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const coupon = await StoreMarketingService.createCoupon(tenantId, storeId, userId, req.body);
      created(res, 'Coupon created successfully', coupon);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async redeemCoupon(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const redemption = await StoreMarketingService.redeemCoupon(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Coupon redeemed successfully', redemption);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // GIFT CARDS & TRANSACTIONS
  static async getGiftCards(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const giftCards = await StoreMarketingService.getGiftCards(tenantId, storeId);
      success(res, 'Gift cards retrieved successfully', giftCards);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createGiftCard(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const giftCard = await StoreMarketingService.createGiftCard(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Gift card issued successfully', giftCard);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async transactGiftCard(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const txn = await StoreMarketingService.transactGiftCard(tenantId, storeId, userId, req.body);
      created(res, 'Gift card transaction processed successfully', txn);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // REFERRALS
  static async getReferrals(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const customerId = parseInt((req.query.customerId as string) || '1', 10);

      const referral = await StoreMarketingService.getReferrals(tenantId, storeId, customerId);
      success(res, 'Referral details retrieved successfully', referral);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // CAMPAIGNS & AUTOMATIONS
  static async getCampaigns(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const campaigns = await StoreMarketingService.getCampaigns(tenantId, storeId);
      success(res, 'Marketing campaigns retrieved successfully', campaigns);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createCampaign(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const campaign = await StoreMarketingService.createCampaign(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Marketing campaign created successfully', campaign);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async getAutomations(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const automations = await StoreMarketingService.getAutomations(tenantId, storeId);
      success(res, 'Marketing automations retrieved successfully', automations);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createAutomation(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const automation = await StoreMarketingService.createAutomation(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Marketing automation workflow created successfully', automation);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }
}
