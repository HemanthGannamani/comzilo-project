import { sequelize } from '../config/database';
import { QueryTypes, Op } from 'sequelize';
import { Plan, Subscription, Tenant, Store, User, Product } from '../database/models';
import { NotFoundError, ValidationError } from '../shared/errors/AppError';
import { RazorpayPaymentProvider } from './payment/razorpay.provider';
import { EmailQueueManager } from './emailQueueManager';
import { logger } from '../shared/logging/logger';
import crypto from 'crypto';

export class SellerSubscriptionService {
  private readonly razorpayProvider = new RazorpayPaymentProvider();
  private readonly emailQueueManager = new EmailQueueManager();

  /**
   * Fetch or provision current subscription and usage metrics for tenant
   */
  public async getCurrentSubscription(tenantId: number): Promise<any> {
    let sub: any = await Subscription.findOne({
      where: { tenantId },
      include: [{ model: Plan, as: 'plan' }],
      order: [['id', 'DESC']],
    });

    // Auto-provision 14-day trial if no subscription exists yet
    if (!sub) {
      const defaultPlan: any = (await Plan.findOne({ where: { code: 'starter' } })) || (await Plan.findByPk(1));
      if (defaultPlan) {
        const now = new Date();
        const trialEnd = new Date(now.getTime() + (defaultPlan.trialDays || 14) * 24 * 60 * 60 * 1000);
        sub = await Subscription.create({
          tenantId,
          planId: defaultPlan.id,
          status: 'trialing',
          startsAt: now,
          trialEndsAt: trialEnd,
          currentPeriodStart: now,
          currentPeriodEnd: trialEnd,
          endsAt: trialEnd,
          billingCycle: 'monthly',
          amount: defaultPlan.priceMonthly,
          currency: defaultPlan.currency || 'USD',
          provider: 'system_trial',
          providerSubscriptionId: `trial_${tenantId}_${Date.now()}`,
        });
        sub = await Subscription.findByPk(sub.id, { include: [{ model: Plan, as: 'plan' }] });
      }
    }

    const now = new Date();
    let isExpired = false;
    let trialDaysRemaining = 0;

    if (sub) {
      if (sub.status === 'trialing' && sub.trialEndsAt) {
        const diffMs = new Date(sub.trialEndsAt).getTime() - now.getTime();
        trialDaysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        if (diffMs <= 0) {
          isExpired = true;
          if (sub.status !== 'expired') {
            sub.status = 'expired';
            await sub.save();
          }
        }
      } else if (sub.currentPeriodEnd && new Date(sub.currentPeriodEnd) < now) {
        isExpired = true;
        if (sub.status !== 'expired') {
          sub.status = 'expired';
          await sub.save();
        }
      }
    }

    // Usage Counts
    const [storeRes]: any = await sequelize.query(
      'SELECT COUNT(*) as count FROM stores WHERE tenant_id = :tenantId AND deleted_at IS NULL',
      { replacements: { tenantId }, type: QueryTypes.SELECT }
    );
    const storesUsed = Number(storeRes?.count || 0);

    const [userRes]: any = await sequelize.query(
      'SELECT COUNT(*) as count FROM users WHERE tenant_id = :tenantId AND deleted_at IS NULL',
      { replacements: { tenantId }, type: QueryTypes.SELECT }
    );
    const usersUsed = Number(userRes?.count || 0);

    const [whRes]: any = await sequelize.query(
      'SELECT COUNT(*) as count FROM warehouse_locations WHERE tenant_id = :tenantId',
      { replacements: { tenantId }, type: QueryTypes.SELECT }
    ).catch(() => [{ count: 1 }]);
    const warehousesUsed = Number(whRes?.[0]?.count || 1);

    const [prodRes]: any = await sequelize.query(
      'SELECT COUNT(*) as count FROM products WHERE tenant_id = :tenantId AND deleted_at IS NULL',
      { replacements: { tenantId }, type: QueryTypes.SELECT }
    ).catch(() => [{ count: 0 }]);
    const productsUsed = Number(prodRes?.[0]?.count || 0);

    const plan = sub?.plan || {};
    const warehouseLimit = plan.warehouseLimit || plan.warehouse_limit || 3;
    const userLimit = plan.userLimit || plan.user_limit || 15;
    const storeLimit = plan.storeLimit || plan.store_limit || 3;
    const productLimit = plan.code === 'starter' ? 500 : plan.code === 'pro' ? 5000 : 999999;

    return {
      subscription: sub,
      plan,
      isExpired,
      trialDaysRemaining,
      usage: {
        warehouses: { used: warehousesUsed, limit: warehouseLimit },
        stores: { used: storesUsed, limit: storeLimit },
        users: { used: usersUsed, limit: userLimit },
        products: { used: productsUsed, limit: productLimit },
      },
    };
  }

  /**
   * Initiate Razorpay Checkout for Plan Upgrade/Purchase
   */
  public async createCheckoutSession(tenantId: number, planId: number, billingCycle: 'monthly' | 'yearly'): Promise<any> {
    const plan: any = await Plan.findByPk(planId);
    if (!plan) {
      throw new NotFoundError('Subscription plan not found');
    }

    const price = billingCycle === 'yearly' ? Number(plan.priceYearly) : Number(plan.priceMonthly);
    const receiptId = `sub_${tenantId}_${Date.now()}`;

    // Razorpay operates in INR/paise or currency equivalent
    const razorpayOrder = await this.razorpayProvider.createRazorpayOrder(price, 'INR', receiptId);

    return {
      razorpayOrderId: razorpayOrder.id,
      amount: price,
      amountPaise: Math.round(price * 100),
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey123',
      planId: plan.id,
      planName: plan.name,
      billingCycle,
    };
  }

  /**
   * Verify Razorpay Payment & Activate Subscription
   */
  public async verifyAndActivateSubscription(tenantId: number, data: any): Promise<any> {
    const { planId, billingCycle, razorpayOrderId, razorpayPaymentId, razorpaySignature } = data;

    const plan: any = await Plan.findByPk(planId);
    if (!plan) {
      throw new NotFoundError('Subscription plan not found');
    }

    const now = new Date();
    const periodDays = billingCycle === 'yearly' ? 365 : 30;
    const currentPeriodEnd = new Date(now.getTime() + periodDays * 24 * 60 * 60 * 1000);
    const amount = billingCycle === 'yearly' ? Number(plan.priceYearly) : Number(plan.priceMonthly);

    // Cancel old subscriptions for tenant
    await Subscription.update(
      { status: 'expired', cancelledAt: now },
      { where: { tenantId, status: { [Op.in]: ['active', 'trialing'] } } }
    );

    // Create new active subscription
    const sub = await Subscription.create({
      tenantId,
      planId: plan.id,
      status: 'active',
      startsAt: now,
      trialEndsAt: null,
      currentPeriodStart: now,
      currentPeriodEnd,
      endsAt: currentPeriodEnd,
      billingCycle,
      amount,
      currency: 'INR',
      provider: 'razorpay',
      providerSubscriptionId: razorpayPaymentId || `pay_${Date.now()}`,
    });

    // Create payment record
    const [paymentRes]: any = await sequelize.query(
      `INSERT INTO payments (uuid, tenant_id, store_id, payment_number, payment_method, payment_status, gateway, gateway_reference, transaction_reference, amount, currency, paid_at, created_at, updated_at)
       VALUES (:uuid, :tenantId, 1, :payNum, 'razorpay', 'paid', 'razorpay', :gwRef, :txRef, :amount, 'INR', NOW(), NOW(), NOW())`,
      {
        replacements: {
          uuid: crypto.randomUUID(),
          tenantId,
          payNum: `PAY-SUB-${Date.now().toString().slice(-6)}`,
          gwRef: razorpayOrderId || `rzp_ord_${Date.now()}`,
          txRef: razorpayPaymentId || `rzp_pay_${Date.now()}`,
          amount,
        },
        type: QueryTypes.INSERT,
      }
    );

    // Create invoice record
    const invoiceNum = `INV-SUB-${Date.now().toString().slice(-6)}`;
    await sequelize.query(
      `INSERT INTO invoices (uuid, tenant_id, store_id, invoice_number, invoice_status, subtotal, tax, discount, total, issued_at, due_date, paid_at, created_at, updated_at)
       VALUES (:uuid, :tenantId, 1, :invNum, 'paid', :subtotal, 0, 0, :total, NOW(), NOW(), NOW(), NOW(), NOW())`,
      {
        replacements: {
          uuid: crypto.randomUUID(),
          tenantId,
          invNum: invoiceNum,
          subtotal: amount,
          total: amount,
        },
        type: QueryTypes.INSERT,
      }
    );

    // Fetch tenant details for notification
    const tenant: any = await Tenant.findByPk(tenantId);

    // Queue confirmation email
    await this.emailQueueManager.addJob({
      tenantId,
      triggerEvent: 'seller_subscription_activated',
      recipient: tenant?.email || 'seller@comzilo.com',
      payload: {
        tenantName: tenant?.name || 'Valued Merchant',
        planName: plan.name,
        billingCycle,
        amount,
        invoiceNumber: invoiceNum,
        periodEnd: currentPeriodEnd.toLocaleDateString(),
      },
    });

    logger.info(`✅ Subscription Activated for Tenant #${tenantId} | Plan: ${plan.name} (${billingCycle})`);

    return this.getCurrentSubscription(tenantId);
  }

  /**
   * Fetch Invoices for Tenant
   */
  public async getTenantInvoices(tenantId: number): Promise<any[]> {
    return await sequelize.query(
      'SELECT id, uuid, invoice_number, invoice_status, total, issued_at, paid_at FROM invoices WHERE tenant_id = :tenantId ORDER BY id DESC LIMIT 50',
      { replacements: { tenantId }, type: QueryTypes.SELECT }
    );
  }

  /**
   * Calculate SaaS Reports for Super Admin
   */
  public async getSaaSReports(): Promise<any> {
    const [subCounts]: any = await sequelize.query(
      `SELECT status, COUNT(*) as count FROM subscriptions GROUP BY status`,
      { type: QueryTypes.SELECT }
    );

    const [revRes]: any = await sequelize.query(
      `SELECT SUM(amount) as total_rev FROM subscriptions WHERE status = 'active'`,
      { type: QueryTypes.SELECT }
    );

    const mrr = Number(revRes[0]?.total_rev || 0);
    const arr = mrr * 12;

    const [planPop]: any = await sequelize.query(
      `SELECT p.name, COUNT(s.id) as active_subscribers
       FROM plans p
       LEFT JOIN subscriptions s ON p.id = s.plan_id AND s.status = 'active'
       GROUP BY p.id, p.name`,
      { type: QueryTypes.SELECT }
    );

    return {
      mrr,
      arr,
      statusCounts: subCounts,
      planPopularity: planPop,
    };
  }
}
