/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from '../../app';
import supertest from 'supertest';
import { logger } from '../../shared/logging/logger';
import { connectDatabase } from '../../config/database';

async function runVerification() {
  await connectDatabase();
  logger.info('=== STARTING STORE CRM MODULE QA VERIFICATION ===');

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

  // 2. CREATE Customer Segment
  logger.info('--- 1. CREATING CUSTOMER SEGMENT ---');
  const createSeg = await supertest(app)
    .post('/api/v1/store/crm/segments')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'VIP High Spenders',
      code: 'vip_tier',
      criteriaRules: { min_orders: 5, min_spend: 1000.0 },
    });

  if (createSeg.status !== 201) {
    throw new Error(`Failed to create segment: ${JSON.stringify(createSeg.body)}`);
  }
  const segmentId = createSeg.body.data.id;
  logger.info(`✅ Customer Segment created ID ${segmentId}`);

  // 3. FETCH Customer Segments List
  logger.info('--- 2. FETCHING CUSTOMER SEGMENTS ---');
  const getSegs = await supertest(app)
    .get('/api/v1/store/crm/segments')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getSegs.status !== 200 || !Array.isArray(getSegs.body.data)) {
    throw new Error(`Failed to fetch segments: ${JSON.stringify(getSegs.body)}`);
  }
  logger.info('✅ Customer Segments fetched successfully.');

  // 4. FETCH Customers List
  logger.info('--- 3. FETCHING CUSTOMERS LIST ---');
  const getCusts = await supertest(app)
    .get('/api/v1/store/crm/customers')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getCusts.status !== 200 || !getCusts.body.data.customers) {
    throw new Error(`Failed to fetch customers: ${JSON.stringify(getCusts.body)}`);
  }
  logger.info(`✅ Customers fetched total ${getCusts.body.data.total}`);

  // 5. CREATE Customer Wishlist with Item
  logger.info('--- 4. CREATING CUSTOMER WISHLIST ---');
  const createWish = await supertest(app)
    .post('/api/v1/store/crm/wishlists')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      customerId: 1,
      name: 'Holiday Season Favorites',
      productId: 1,
      addedPrice: 199.99,
    });

  if (createWish.status !== 201) {
    throw new Error(`Failed to create wishlist: ${JSON.stringify(createWish.body)}`);
  }
  const wishlistId = createWish.body.data.id;
  logger.info(`✅ Wishlist created ID ${wishlistId}`);

  // 6. FETCH Customer Wishlists List
  logger.info('--- 5. FETCHING CUSTOMER WISHLISTS ---');
  const getWishs = await supertest(app)
    .get('/api/v1/store/crm/wishlists?customerId=1')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getWishs.status !== 200 || !Array.isArray(getWishs.body.data)) {
    throw new Error(`Failed to fetch wishlists: ${JSON.stringify(getWishs.body)}`);
  }
  logger.info('✅ Customer Wishlists fetched successfully.');

  // 7. INITIALIZE / FETCH Loyalty Account & TRANSACT Rewards
  logger.info('--- 6. LOYALTY ACCOUNT & REWARD POINTS ---');
  const getLoyalty = await supertest(app)
    .get('/api/v1/store/crm/loyalty?customerId=1')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getLoyalty.status !== 200) {
    throw new Error(`Failed to fetch loyalty account: ${JSON.stringify(getLoyalty.body)}`);
  }
  logger.info('✅ Loyalty Account fetched successfully.');

  const transactReward = await supertest(app)
    .post('/api/v1/store/crm/rewards')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      customerId: 1,
      transactionType: 'earn',
      points: 750,
      reference: 'PURCHASE_BONUS_CAMPAIGN',
    });

  if (transactReward.status !== 201) {
    throw new Error(`Failed to transact reward points: ${JSON.stringify(transactReward.body)}`);
  }
  logger.info(`✅ Reward points earned! New Tier: ${transactReward.body.data.account.tierLevel}`);

  // 8. CREATE Support Ticket & POST Staff Reply
  logger.info('--- 7. CREATING SUPPORT TICKET & POSTING REPLY ---');
  const createTick = await supertest(app)
    .post('/api/v1/store/crm/tickets')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      customerId: 1,
      subject: 'Inquiry regarding shipping address update',
      priority: 'high',
      category: 'Shipping & Delivery',
      initialMessage: 'Can I change my delivery address for Order #1234?',
    });

  if (createTick.status !== 201) {
    throw new Error(`Failed to create ticket: ${JSON.stringify(createTick.body)}`);
  }
  const ticketId = createTick.body.data.id;
  logger.info(`✅ Support Ticket created ID ${ticketId}`);

  const replyTick = await supertest(app)
    .post(`/api/v1/store/crm/tickets/${ticketId}/replies`)
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      message: 'Hello! Sure, we have updated your address to the new location.',
      status: 'in_progress',
      isStaffReply: true,
    });

  if (replyTick.status !== 201) {
    throw new Error(`Failed to reply ticket: ${JSON.stringify(replyTick.body)}`);
  }
  logger.info('✅ Staff ticket reply posted successfully.');

  // 9. LOG Customer Communication
  logger.info('--- 8. LOGGING CUSTOMER COMMUNICATION ---');
  const logComm = await supertest(app)
    .post('/api/v1/store/crm/communications')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      customerId: 1,
      channel: 'email',
      subject: 'Welcome to VIP Club Loyalty Tier!',
      messageBody: 'Dear customer, you have been promoted to Silver Tier!',
    });

  if (logComm.status !== 201) {
    throw new Error(`Failed to log communication: ${JSON.stringify(logComm.body)}`);
  }
  logger.info(`✅ Communication logged ID ${logComm.body.data.id}`);

  logger.info('🎉 STORE CRM MODULE QA VERIFICATION PASSED');
  process.exit(0);
}

runVerification().catch((error) => {
  logger.error(`❌ Store CRM QA verification failed: ${error.message}`);
  logger.error(error.stack);
  process.exit(1);
});
