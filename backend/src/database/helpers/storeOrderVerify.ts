/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from '../../app';
import supertest from 'supertest';
import { logger } from '../../shared/logging/logger';
import { connectDatabase } from '../../config/database';

async function runVerification() {
  await connectDatabase();
  logger.info('=== STARTING STORE ORDER MODULE QA VERIFICATION ===');

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

  // 2. CREATE Order with Immutable Snapshot Items
  logger.info('--- 1. CREATING ORDER WITH SNAPSHOT ITEMS ---');
  const createOrd = await supertest(app)
    .post('/api/v1/store/orders')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      customerEmail: 'customer@example.com',
      currency: 'USD',
      shippingAmount: 15.0,
      taxAmount: 5.0,
      discountAmount: 2.0,
      items: [
        {
          productId: 1,
          variantId: 1,
          productName: 'Enterprise Laptop Pro',
          sku: 'ELP-2026-X1',
          price: 1200.0,
          quantity: 1,
        },
      ],
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        addressLine1: '100 Innovation Way',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'USA',
      },
    });

  if (createOrd.status !== 201) {
    throw new Error(`Failed to create order: ${JSON.stringify(createOrd.body)}`);
  }
  const orderId = createOrd.body.data.id;
  logger.info(`✅ Order created ID ${orderId}`);

  // 3. FETCH Orders List
  logger.info('--- 2. FETCHING ORDERS LIST ---');
  const getOrders = await supertest(app)
    .get('/api/v1/store/orders')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getOrders.status !== 200 || !getOrders.body.data.orders) {
    throw new Error(`Failed to fetch orders: ${JSON.stringify(getOrders.body)}`);
  }
  logger.info(`✅ Orders list fetched total ${getOrders.body.data.total}`);

  // 4. FETCH Order Details
  logger.info('--- 3. FETCHING ORDER DETAILS ---');
  const getDetail = await supertest(app)
    .get(`/api/v1/store/orders/${orderId}`)
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getDetail.status !== 200) {
    throw new Error(`Failed to fetch order detail: ${JSON.stringify(getDetail.body)}`);
  }
  logger.info('✅ Order detail fetched with nested items and status history.');

  // 5. UPDATE Order Status Workflow to Confirmed
  logger.info('--- 4. ADVANCING STATUS WORKFLOW TO CONFIRMED ---');
  const updateStatus = await supertest(app)
    .patch(`/api/v1/store/orders/${orderId}/status`)
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({ status: 'confirmed', comment: 'Payment authorized by buyer' });

  if (updateStatus.status !== 200) {
    throw new Error(`Failed to update status: ${JSON.stringify(updateStatus.body)}`);
  }
  logger.info('✅ Status workflow updated to confirmed.');

  // 6. RECORD Payment
  logger.info('--- 5. RECORDING PAYMENT TRANSACTION ---');
  const recPay = await supertest(app)
    .post(`/api/v1/store/orders/${orderId}/payments`)
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      gateway: 'stripe',
      paymentMethod: 'credit_card',
      transactionId: `TXN-${Date.now()}`,
      amount: 1218.0,
    });

  if (recPay.status !== 201) {
    throw new Error(`Failed to record payment: ${JSON.stringify(recPay.body)}`);
  }
  logger.info(`✅ Payment recorded ID ${recPay.body.data.id}`);

  // 7. GENERATE Invoice
  logger.info('--- 6. GENERATING INVOICE ---');
  const genInv = await supertest(app)
    .post(`/api/v1/store/orders/${orderId}/invoices`)
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({ status: 'issued' });

  if (genInv.status !== 201) {
    throw new Error(`Failed to generate invoice: ${JSON.stringify(genInv.body)}`);
  }
  logger.info(`✅ Invoice generated ID ${genInv.body.data.id}`);

  // 8. CREATE Shipment & Carrier Tracking
  logger.info('--- 7. CREATING SHIPMENT TRACKING ---');
  const createShip = await supertest(app)
    .post(`/api/v1/store/orders/${orderId}/shipments`)
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      carrier: 'FedEx Express',
      trackingNumber: 'FDX-99887766',
      shippingCost: 15.0,
    });

  if (createShip.status !== 201) {
    throw new Error(`Failed to create shipment: ${JSON.stringify(createShip.body)}`);
  }
  logger.info(`✅ Shipment created ID ${createShip.body.data.id}`);

  // 9. REQUEST Return Workflow
  logger.info('--- 8. REQUESTING RETURN WORKFLOW ---');
  const reqRet = await supertest(app)
    .post(`/api/v1/store/orders/${orderId}/returns`)
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      reason: 'Wrong size delivered',
      restockInventory: true,
    });

  if (reqRet.status !== 201) {
    throw new Error(`Failed to request return: ${JSON.stringify(reqRet.body)}`);
  }
  logger.info(`✅ Return requested ID ${reqRet.body.data.id}`);

  // 10. ISSUE Refund
  logger.info('--- 9. ISSUING REFUND ---');
  const issueRef = await supertest(app)
    .post(`/api/v1/store/orders/${orderId}/refunds`)
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      amount: 1218.0,
      reason: 'Full order return refund',
    });

  if (issueRef.status !== 201) {
    throw new Error(`Failed to issue refund: ${JSON.stringify(issueRef.body)}`);
  }
  logger.info(`✅ Refund issued ID ${issueRef.body.data.id}`);

  logger.info('🎉 STORE ORDER MODULE QA VERIFICATION PASSED');
  process.exit(0);
}

runVerification().catch((error) => {
  logger.error(`❌ Store Order QA verification failed: ${error.message}`);
  logger.error(error.stack);
  process.exit(1);
});
