/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from '../../app';
import supertest from 'supertest';
import { logger } from '../../shared/logging/logger';
import { connectDatabase } from '../../config/database';

async function runVerification() {
  await connectDatabase();
  logger.info('=== STARTING STORE PAYMENT MODULE QA VERIFICATION ===');

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

  // 2. CONFIGURE Payment Gateway (Stripe)
  logger.info('--- 1. CONFIGURING PAYMENT GATEWAY ---');
  const createGw = await supertest(app)
    .post('/api/v1/store/payments/gateways')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'Stripe Payments',
      code: 'stripe',
      apiKeyEncrypted: 'pk_test_sample123',
      secretKeyEncrypted: 'sk_test_sample123',
      webhookSecret: 'whsec_sample123',
      isSandbox: true,
    });

  if (createGw.status !== 201) {
    throw new Error(`Failed to create gateway: ${JSON.stringify(createGw.body)}`);
  }
  const gatewayId = createGw.body.data.id;
  logger.info(`✅ Payment Gateway configured ID ${gatewayId}`);

  // 3. FETCH Payment Gateways List
  logger.info('--- 2. FETCHING GATEWAYS LIST ---');
  const getGws = await supertest(app)
    .get('/api/v1/store/payments/gateways')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getGws.status !== 200 || !Array.isArray(getGws.body.data)) {
    throw new Error(`Failed to fetch gateways: ${JSON.stringify(getGws.body)}`);
  }
  logger.info('✅ Gateways list fetched successfully.');

  // 4. CREATE Test Order & Record Payment
  logger.info('--- 3. CREATING TEST ORDER & RECORDING PAYMENT ---');
  const ordRes = await supertest(app)
    .post('/api/v1/store/orders')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      customerEmail: 'financial_test@comzilo.com',
      items: [{ productId: 1, variantId: 1, price: 250.0, quantity: 1 }],
    });

  const orderId = ordRes.body.data.id;

  const recPay = await supertest(app)
    .post(`/api/v1/store/orders/${orderId}/payments`)
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      gateway: 'stripe',
      paymentMethod: 'credit_card',
      transactionId: `TXN-${Date.now()}`,
      amount: 250.0,
    });

  if (recPay.status !== 201) {
    throw new Error(`Failed to record payment: ${JSON.stringify(recPay.body)}`);
  }
  const paymentId = recPay.body.data.id;
  logger.info(`✅ Payment recorded ID ${paymentId}`);

  // 5. FETCH Transactions List
  logger.info('--- 4. FETCHING TRANSACTIONS LIST ---');
  const getTxns = await supertest(app)
    .get('/api/v1/store/payments/transactions')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getTxns.status !== 200 || !getTxns.body.data.transactions) {
    throw new Error(`Failed to fetch transactions: ${JSON.stringify(getTxns.body)}`);
  }
  logger.info(`✅ Transactions list fetched total ${getTxns.body.data.total}`);

  // 6. RECORD Payment Retry Attempt
  logger.info('--- 5. RECORDING TRANSACTION ATTEMPT ---');
  const recAtt = await supertest(app)
    .post('/api/v1/store/payments/attempts')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      paymentId,
      attemptNumber: 1,
      status: 'success',
      gatewayResponse: { code: 200, status: 'succeeded' },
    });

  if (recAtt.status !== 201) {
    throw new Error(`Failed to record attempt: ${JSON.stringify(recAtt.body)}`);
  }
  logger.info(`✅ Transaction attempt recorded ID ${recAtt.body.data.id}`);

  // 7. RECORD Gateway Settlement Payout
  logger.info('--- 6. CREATING GATEWAY SETTLEMENT PAYOUT ---');
  const createSettle = await supertest(app)
    .post('/api/v1/store/payments/settlements')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      gatewayCode: 'stripe',
      grossAmount: 5000.0,
      gatewayFees: 125.0,
      taxAmount: 22.5,
    });

  if (createSettle.status !== 201) {
    throw new Error(`Failed to create settlement: ${JSON.stringify(createSettle.body)}`);
  }
  logger.info(`✅ Settlement recorded ID ${createSettle.body.data.id}`);

  // 8. EXECUTE Automated Financial Reconciliation
  logger.info('--- 7. EXECUTING AUTOMATED RECONCILIATION ---');
  const runReconcile = await supertest(app)
    .post('/api/v1/store/payments/reconciliation')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      periodStart: '2026-07-01',
      periodEnd: '2026-07-31',
      totalOrders: 20,
      totalCaptured: 5000.0,
      totalSettled: 4852.5,
      mismatchCount: 0,
    });

  if (runReconcile.status !== 201) {
    throw new Error(`Failed to run reconciliation: ${JSON.stringify(runReconcile.body)}`);
  }
  logger.info(`✅ Financial reconciliation completed ID ${runReconcile.body.data.id}`);

  // 9. ISSUE Credit Note
  logger.info('--- 8. ISSUING CREDIT NOTE ---');
  const createCN = await supertest(app)
    .post('/api/v1/store/payments/credit-notes')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      orderId,
      amount: 50.0,
      reason: 'Damaged packaging goodwill credit',
    });

  if (createCN.status !== 201) {
    throw new Error(`Failed to create credit note: ${JSON.stringify(createCN.body)}`);
  }
  logger.info(`✅ Credit Note issued ID ${createCN.body.data.id}`);

  // 10. TRANSACT Customer Wallet
  logger.info('--- 9. TRANSACTING CUSTOMER WALLET ---');
  const transactWallet = await supertest(app)
    .post('/api/v1/store/payments/wallet')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      customerId: 1,
      transactionType: 'credit',
      amount: 50.0,
      reference: 'ORDER_RETURN_REFUND',
    });

  if (transactWallet.status !== 201) {
    throw new Error(`Failed to transact wallet: ${JSON.stringify(transactWallet.body)}`);
  }
  logger.info(`✅ Wallet transaction logged ID ${transactWallet.body.data.id}`);

  logger.info('🎉 STORE PAYMENT MODULE QA VERIFICATION PASSED');
  process.exit(0);
}

runVerification().catch((error) => {
  logger.error(`❌ Store Payment QA verification failed: ${error.message}`);
  logger.error(error.stack);
  process.exit(1);
});
