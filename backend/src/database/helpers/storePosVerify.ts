/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from '../../app';
import supertest from 'supertest';
import { logger } from '../../shared/logging/logger';
import { connectDatabase } from '../../config/database';

async function runVerification() {
  await connectDatabase();
  logger.info('=== STARTING STORE POS MODULE QA VERIFICATION ===');

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

  // 2. CREATE POS REGISTER & OPEN SESSION
  logger.info('--- 1. CREATING REGISTER & OPENING SESSION ---');
  const createReg = await supertest(app)
    .post('/api/v1/store/pos/registers')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'Main Counter Register 01',
      code: 'POS_MAIN_01',
    });

  if (createReg.status !== 201) {
    throw new Error(`Failed to create register: ${JSON.stringify(createReg.body)}`);
  }
  const registerId = createReg.body.data.id;
  logger.info(`✅ POS Register created ID ${registerId}`);

  const openSess = await supertest(app)
    .post('/api/v1/store/pos/registers/open-session')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      registerId,
      openingCash: 200.0,
    });

  if (openSess.status !== 201) {
    throw new Error(`Failed to open session: ${JSON.stringify(openSess.body)}`);
  }
  const sessionId = openSess.body.data.id;
  logger.info(`✅ Register Session opened ID ${sessionId} (Opening Cash Float: $200.00)`);

  // 3. PROCESS POS SALE WITH SPLIT PAYMENTS
  logger.info('--- 2. RINGING UP SALE WITH SPLIT PAYMENTS ---');
  const processSale = await supertest(app)
    .post('/api/v1/store/pos/sales/process')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      sessionId,
      items: [
        { productId: 1, variantId: 1, barcode: '890123456789', quantity: 2, unitPrice: 50.0 },
      ],
      taxAmount: 10.0,
      discountAmount: 10.0,
      payments: [
        { paymentMethod: 'cash', amountPaid: 50.0, changeGiven: 0.0 },
        { paymentMethod: 'card', amountPaid: 50.0, changeGiven: 0.0 },
      ],
    });

  if (processSale.status !== 201) {
    throw new Error(`Failed to process POS sale: ${JSON.stringify(processSale.body)}`);
  }
  const saleId = processSale.body.data.id;
  logger.info(
    `✅ POS Sale completed ID ${saleId} (Sale Number: ${processSale.body.data.saleNumber}, Total: $100.00)`
  );

  // 4. CASH DRAWER MOVEMENT (PAYOUT / DROP)
  logger.info('--- 3. RECORDING CASH DRAWER MOVEMENT ---');
  const cashMove = await supertest(app)
    .post('/api/v1/store/pos/registers/cash-movement')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      sessionId,
      movementType: 'drop',
      amount: 20.0,
      reason: 'Midday Safe Drop',
    });

  if (cashMove.status !== 201) {
    throw new Error(`Failed to record cash movement: ${JSON.stringify(cashMove.body)}`);
  }
  logger.info(`✅ Cash Movement recorded ID ${cashMove.body.data.id}`);

  // 5. PROCESS POS SALE RETURN
  logger.info('--- 4. PROCESSING POS RETURN & REFUND ---');
  const processRet = await supertest(app)
    .post('/api/v1/store/pos/returns/process')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      saleId,
      refundAmount: 50.0,
      refundMethod: 'cash',
      reason: 'Size Exchange Return',
    });

  if (processRet.status !== 201) {
    throw new Error(`Failed to process POS return: ${JSON.stringify(processRet.body)}`);
  }
  logger.info(
    `✅ POS Return processed ID ${processRet.body.data.id} (Return Number: ${processRet.body.data.returnNumber})`
  );

  // 6. OFFLINE SYNC QUEUE PROCESSING
  logger.info('--- 5. SYNCHRONIZING OFFLINE QUEUE ---');
  const syncOffline = await supertest(app)
    .post('/api/v1/store/pos/offline-sync')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      payloads: [
        {
          offlineGuid: 'GUID-POS-OFFLINE-991',
          items: [{ productId: 1, quantity: 1, unitPrice: 25.0 }],
          payments: [{ paymentMethod: 'cash', amountPaid: 25.0 }],
        },
      ],
    });

  if (syncOffline.status !== 201) {
    throw new Error(`Failed to sync offline queue: ${JSON.stringify(syncOffline.body)}`);
  }
  logger.info(
    `✅ Offline Queue Synced successfully (${syncOffline.body.data.length} transactions)`
  );

  // 7. CLOSE SESSION & RECONCILE CASH
  logger.info('--- 6. CLOSING REGISTER SESSION & RECONCILING CASH ---');
  const closeSess = await supertest(app)
    .post('/api/v1/store/pos/registers/close-session')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      sessionId,
      closingCash: 230.0, // Expected: 200 opening + 50 cash sale - 20 drop = 230
    });

  if (closeSess.status !== 200 || closeSess.body.data.status !== 'closed') {
    throw new Error(`Failed to close session: ${JSON.stringify(closeSess.body)}`);
  }
  logger.info(
    `✅ Session closed. Expected Cash: $${closeSess.body.data.expectedCash}, Difference: $${closeSess.body.data.cashDifference}`
  );

  logger.info('🎉 STORE POS MODULE QA VERIFICATION PASSED');
  process.exit(0);
}

runVerification().catch((error) => {
  logger.error(`❌ Store POS QA verification failed: ${error.message}`);
  logger.error(error.stack);
  process.exit(1);
});
