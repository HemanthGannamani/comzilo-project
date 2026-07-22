/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MarketingPromotion,
  Coupon,
  CouponRedemption,
  GiftCard,
  GiftCardTransaction,
  ReferralProgram,
  MarketingCampaign,
  MarketingAutomation,
} from '../database/models';
import { createAuditLog } from '../utils/auditHelper';

export class StoreMarketingService {
  // ================= PROMOTIONS =================
  static async getPromotions(tenantId: number, storeId: number) {
    const promotions = await MarketingPromotion.findAll({
      where: { tenantId, storeId },
      order: [['id', 'DESC']],
    });
    return promotions;
  }

  static async createPromotion(tenantId: number, storeId: number, userId: number, payload: any) {
    const promotion = await MarketingPromotion.create({
      tenantId,
      storeId,
      name: payload.name,
      type: payload.type || 'percentage',
      value: payload.value || 0.0,
      minOrderAmount: payload.minOrderAmount || null,
      startDate: payload.startDate || null,
      endDate: payload.endDate || null,
      status: payload.status || 'active',
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'promotion.created',
      entityType: 'MarketingPromotion',
      entityId: String(promotion.id),
    });

    return promotion;
  }

  // ================= COUPONS & REDEMPTIONS =================
  static async getCoupons(tenantId: number, storeId: number) {
    const coupons = await Coupon.findAll({
      where: { tenantId, storeId },
      include: [{ model: CouponRedemption, as: 'redemptions' }],
      order: [['id', 'DESC']],
    });
    return coupons;
  }

  static async createCoupon(tenantId: number, storeId: number, userId: number, payload: any) {
    const coupon = await Coupon.create({
      tenantId,
      storeId,
      promotionId: payload.promotionId || null,
      code: (payload.code || `COUPON-${Date.now()}`).toUpperCase(),
      usageLimit: payload.usageLimit || null,
      perCustomerLimit: payload.perCustomerLimit || 1,
      minOrderAmount: payload.minOrderAmount || null,
      maxDiscountAmount: payload.maxDiscountAmount || null,
      expiryDate: payload.expiryDate || null,
      status: payload.status || 'active',
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'coupon.created',
      entityType: 'Coupon',
      entityId: String(coupon.id),
    });

    return coupon;
  }

  static async redeemCoupon(tenantId: number, storeId: number, userId: number, payload: any) {
    const coupon = await Coupon.findOne({
      where: { tenantId, storeId, code: payload.code.toUpperCase() },
    });
    if (!coupon) throw new Error('Coupon code not found');
    if (coupon.status !== 'active') throw new Error('Coupon is inactive');

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new Error('Coupon usage limit reached');
    }

    const discountAmount = payload.discountAmount || 10.0;

    await coupon.update({ usedCount: coupon.usedCount + 1 });

    const redemption = await CouponRedemption.create({
      tenantId,
      storeId,
      couponId: coupon.id,
      customerId: payload.customerId,
      orderId: payload.orderId,
      discountAmount,
      redeemedAt: new Date(),
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'coupon.redeemed',
      entityType: 'CouponRedemption',
      entityId: String(redemption.id),
    });

    return redemption;
  }

  // ================= GIFT CARDS =================
  static async getGiftCards(tenantId: number, storeId: number) {
    const giftCards = await GiftCard.findAll({
      where: { tenantId, storeId },
      include: [{ model: GiftCardTransaction, as: 'transactions' }],
      order: [['id', 'DESC']],
    });
    return giftCards;
  }

  static async createGiftCard(tenantId: number, storeId: number, userId: number, payload: any) {
    const giftCardNumber = `GC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const initialValue = Number(payload.initialValue || 100.0);

    const giftCard = await GiftCard.create({
      tenantId,
      storeId,
      giftCardNumber,
      initialValue,
      remainingBalance: initialValue,
      expiryDate: payload.expiryDate || null,
      status: 'active',
    });

    await GiftCardTransaction.create({
      tenantId,
      storeId,
      giftCardId: giftCard.id,
      orderId: null,
      transactionType: 'credit',
      amount: initialValue,
      balanceAfter: initialValue,
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'gift_card.issued',
      entityType: 'GiftCard',
      entityId: String(giftCard.id),
    });

    return giftCard;
  }

  static async transactGiftCard(tenantId: number, storeId: number, userId: number, payload: any) {
    const giftCard = await GiftCard.findOne({
      where: { tenantId, storeId, id: payload.giftCardId },
    });
    if (!giftCard) throw new Error('Gift card not found');

    const amount = Number(payload.amount);
    const isCredit = payload.transactionType === 'credit';
    const balanceAfter = isCredit
      ? Number(giftCard.remainingBalance) + amount
      : Number(giftCard.remainingBalance) - amount;

    if (balanceAfter < 0) throw new Error('Insufficient gift card balance');

    await giftCard.update({ remainingBalance: balanceAfter });

    const txn = await GiftCardTransaction.create({
      tenantId,
      storeId,
      giftCardId: giftCard.id,
      orderId: payload.orderId || null,
      transactionType: payload.transactionType || 'debit',
      amount,
      balanceAfter,
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: `gift_card.${payload.transactionType || 'debit'}`,
      entityType: 'GiftCardTransaction',
      entityId: String(txn.id),
    });

    return txn;
  }

  // ================= REFERRALS =================
  static async getReferrals(tenantId: number, storeId: number, customerId: number) {
    let referral = await ReferralProgram.findOne({
      where: { tenantId, storeId, customerId },
    });

    if (!referral) {
      const referralCode = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      referral = await ReferralProgram.create({
        tenantId,
        storeId,
        customerId,
        referralCode,
        referrerReward: 10.0,
        friendReward: 10.0,
        referralsCount: 0,
        status: 'active',
      });
    }

    return referral;
  }

  // ================= CAMPAIGNS =================
  static async getCampaigns(tenantId: number, storeId: number) {
    const campaigns = await MarketingCampaign.findAll({
      where: { tenantId, storeId },
      order: [['id', 'DESC']],
    });
    return campaigns;
  }

  static async createCampaign(tenantId: number, storeId: number, userId: number, payload: any) {
    const campaign = await MarketingCampaign.create({
      tenantId,
      storeId,
      name: payload.name,
      channel: payload.channel || 'email',
      subject: payload.subject || null,
      content: payload.content || 'Campaign message content',
      status: payload.status || 'draft',
      scheduledAt: payload.scheduledAt || null,
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'marketing_campaign.created',
      entityType: 'MarketingCampaign',
      entityId: String(campaign.id),
    });

    return campaign;
  }

  // ================= AUTOMATIONS =================
  static async getAutomations(tenantId: number, storeId: number) {
    const automations = await MarketingAutomation.findAll({
      where: { tenantId, storeId },
      order: [['id', 'DESC']],
    });
    return automations;
  }

  static async createAutomation(tenantId: number, storeId: number, userId: number, payload: any) {
    const automation = await MarketingAutomation.create({
      tenantId,
      storeId,
      name: payload.name,
      triggerType: payload.triggerType || 'abandoned_cart',
      channel: payload.channel || 'email',
      delayMinutes: payload.delayMinutes || 60,
      status: payload.status || 'active',
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'marketing_automation.created',
      entityType: 'MarketingAutomation',
      entityId: String(automation.id),
    });

    return automation;
  }
}
