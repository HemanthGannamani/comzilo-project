/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from '../../app';
import supertest from 'supertest';
import { logger } from '../../shared/logging/logger';
import { connectDatabase } from '../../config/database';

async function runVerification() {
  await connectDatabase();
  logger.info('=== STARTING STORE MARKETING MODULE QA VERIFICATION ===');

  // 1. Authenticate Seller Admin
  const loginRes = await supertest(app)
    .post('/api/v1/auth/login')
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      email: 'admin@comzilo.com',
      password: 'SuperAdminSecurePassword2026!',
    });

  const token = loginRes.body.data.accessToken;
  logger.info('Seller / Store Admin authenticated successfully.');

  // 2. CREATE Marketing Promotion
  logger.info('--- 1. CREATING PROMOTION ---');
  const createPromo = await supertest(app)
    .post('/api/v1/store/marketing/promotions')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'Summer Mega Flash Sale',
      type: 'percentage',
      value: 20.0,
      minOrderAmount: 50.0,
    });

  if (createPromo.status !== 201) {
    throw new Error(`Failed to create promotion: ${JSON.stringify(createPromo.body)}`);
  }
  const promoId = createPromo.body.data.id;
  logger.info(`✅ Promotion created ID ${promoId}`);

  // 3. CREATE & REDEEM Coupon
  logger.info('--- 2. CREATING & REDEEMING COUPON ---');
  const createCpn = await supertest(app)
    .post('/api/v1/store/marketing/coupons')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      promotionId: promoId,
      code: 'SUMMER20',
      usageLimit: 100,
      perCustomerLimit: 1,
      minOrderAmount: 50.0,
      maxDiscountAmount: 30.0,
    });

  if (createCpn.status !== 201) {
    throw new Error(`Failed to create coupon: ${JSON.stringify(createCpn.body)}`);
  }
  const couponId = createCpn.body.data.id;
  logger.info(`✅ Coupon created ID ${couponId}`);

  // Create Order for Redemption
  const ordRes = await supertest(app)
    .post('/api/v1/store/orders')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      customerEmail: 'coupon_user@comzilo.com',
      items: [{ productId: 1, variantId: 1, price: 100.0, quantity: 1 }],
    });

  const orderId = ordRes.body.data.id;

  const redeemCpn = await supertest(app)
    .post('/api/v1/store/marketing/coupons/redeem')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      code: 'SUMMER20',
      customerId: 1,
      orderId,
      discountAmount: 20.0,
    });

  if (redeemCpn.status !== 201) {
    throw new Error(`Failed to redeem coupon: ${JSON.stringify(redeemCpn.body)}`);
  }
  logger.info(`✅ Coupon SUMMER20 redeemed ID ${redeemCpn.body.data.id}`);

  // 4. ISSUE & TRANSACT Gift Card
  logger.info('--- 3. ISSUING & TRANSACTING GIFT CARD ---');
  const issueGc = await supertest(app)
    .post('/api/v1/store/marketing/gift-cards')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      initialValue: 100.0,
      expiryDate: '2027-12-31',
    });

  if (issueGc.status !== 201) {
    throw new Error(`Failed to issue gift card: ${JSON.stringify(issueGc.body)}`);
  }
  const giftCardId = issueGc.body.data.id;
  logger.info(`✅ Gift Card issued ID ${giftCardId} (Card: ${issueGc.body.data.giftCardNumber})`);

  const transactGc = await supertest(app)
    .post('/api/v1/store/marketing/gift-cards/transact')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      giftCardId,
      orderId,
      transactionType: 'debit',
      amount: 25.0,
    });

  if (transactGc.status !== 201) {
    throw new Error(`Failed to transact gift card: ${JSON.stringify(transactGc.body)}`);
  }
  logger.info(
    `✅ Gift Card debited $25.00! Remaining balance: $${transactGc.body.data.balanceAfter}`
  );

  // 5. FETCH Customer Referral Program Details
  logger.info('--- 4. FETCHING REFERRAL DETAILS ---');
  const getRef = await supertest(app)
    .get('/api/v1/store/marketing/referrals?customerId=1')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getRef.status !== 200) {
    throw new Error(`Failed to fetch referral details: ${JSON.stringify(getRef.body)}`);
  }
  logger.info(`✅ Customer Referral Code fetched: ${getRef.body.data.referralCode}`);

  // 6. CREATE Marketing Campaign & Automation Trigger
  logger.info('--- 5. CREATING MARKETING CAMPAIGN & AUTOMATION ---');
  const createCamp = await supertest(app)
    .post('/api/v1/store/marketing/campaigns')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'Summer Exclusive VIP Offer',
      channel: 'email',
      subject: 'Special 20% Off Just For You!',
      content: '<p>Use code SUMMER20 at checkout today!</p>',
      status: 'scheduled',
      scheduledAt: '2026-08-01T00:00:00Z',
    });

  if (createCamp.status !== 201) {
    throw new Error(`Failed to create campaign: ${JSON.stringify(createCamp.body)}`);
  }
  logger.info(`✅ Marketing Campaign created ID ${createCamp.body.data.id}`);

  const createAuto = await supertest(app)
    .post('/api/v1/store/marketing/automation')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: '1-Hour Abandoned Cart Email Recovery',
      triggerType: 'abandoned_cart',
      channel: 'email',
      delayMinutes: 60,
    });

  if (createAuto.status !== 201) {
    throw new Error(`Failed to create automation: ${JSON.stringify(createAuto.body)}`);
  }
  logger.info(`✅ Marketing Automation Workflow created ID ${createAuto.body.data.id}`);

  logger.info('🎉 STORE MARKETING MODULE QA VERIFICATION PASSED');
  process.exit(0);
}

runVerification().catch((error) => {
  logger.error(`❌ Store Marketing QA verification failed: ${error.message}`);
  logger.error(error.stack);
  process.exit(1);
});
