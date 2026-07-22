/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from '../../app';
import supertest from 'supertest';
import { logger } from '../../shared/logging/logger';
import { connectDatabase } from '../../config/database';

async function runVerification() {
  await connectDatabase();
  logger.info('=== STARTING STORE INVENTORY MODULE QA VERIFICATION ===');

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

  // 2. CREATE Warehouse
  logger.info('--- 1. CREATING WAREHOUSE ---');
  const createWh = await supertest(app)
    .post('/api/v1/store/inventory/warehouses')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: `Central Distribution Hub ${Date.now()}`,
      code: `CDH-${Date.now()}`,
      city: 'New York',
      country: 'USA',
    });

  if (createWh.status !== 201) {
    throw new Error(`Failed to create warehouse: ${JSON.stringify(createWh.body)}`);
  }
  const warehouseId = createWh.body.data.id;
  logger.info(`✅ Warehouse created ID ${warehouseId}`);

  // 3. CREATE Warehouse Location
  logger.info('--- 2. CREATING WAREHOUSE LOCATION ---');
  const createLoc = await supertest(app)
    .post(`/api/v1/store/inventory/warehouses/${warehouseId}/locations`)
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'Rack A Shelf 01',
      code: 'RA-S01',
      type: 'shelf',
    });

  if (createLoc.status !== 201) {
    throw new Error(`Failed to create location: ${JSON.stringify(createLoc.body)}`);
  }
  logger.info(`✅ Location created ID ${createLoc.body.data.id}`);

  // 4. UPDATE Stock & Append to Ledger
  logger.info('--- 3. UPDATING STOCK BALANCE & APPENDING TO LEDGER ---');
  const updateStock = await supertest(app)
    .post('/api/v1/store/inventory/items/update-stock')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      warehouseId,
      productId: 1,
      quantity: 150,
      mode: 'set',
      movementType: 'purchase',
      reason: 'Initial supplier shipment received',
    });

  if (updateStock.status !== 200) {
    throw new Error(`Failed to update stock: ${JSON.stringify(updateStock.body)}`);
  }
  logger.info('✅ Stock updated and logged to movement ledger.');

  // 5. GET Movements Ledger
  logger.info('--- 4. FETCHING MOVEMENTS LEDGER ---');
  const movementsRes = await supertest(app)
    .get('/api/v1/store/inventory/movements')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (movementsRes.status !== 200 || !Array.isArray(movementsRes.body.data)) {
    throw new Error(`Failed to fetch movements: ${JSON.stringify(movementsRes.body)}`);
  }
  logger.info('✅ Movement audit ledger verified.');

  // 6. CREATE Stock Transfer Workflow
  logger.info('--- 5. CREATING STOCK TRANSFER ---');
  const createTrf = await supertest(app)
    .post('/api/v1/store/inventory/transfers')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      sourceWarehouseId: warehouseId,
      destinationWarehouseId: warehouseId,
      items: [{ productId: 1, quantity: 20 }],
    });

  if (createTrf.status !== 201) {
    throw new Error(`Failed to create transfer: ${JSON.stringify(createTrf.body)}`);
  }
  const transferId = createTrf.body.data.id;
  logger.info(`✅ Stock transfer created ID ${transferId}`);

  // 7. UPDATE Transfer Status to Approved
  logger.info('--- 6. ADVANCING TRANSFER STATUS TO APPROVED ---');
  const updateStatus = await supertest(app)
    .patch(`/api/v1/store/inventory/transfers/${transferId}/status`)
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({ status: 'approved' });

  if (updateStatus.status !== 200) {
    throw new Error(`Failed to update transfer status: ${JSON.stringify(updateStatus.body)}`);
  }
  logger.info('✅ Transfer workflow status update verified.');

  // 8. CREATE Reservation
  logger.info('--- 7. CREATING STOCK RESERVATION ---');
  const createRes = await supertest(app)
    .post('/api/v1/store/inventory/reservations')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      warehouseId,
      productId: 1,
      quantity: 5,
    });

  if (createRes.status !== 201) {
    throw new Error(`Failed to create reservation: ${JSON.stringify(createRes.body)}`);
  }
  logger.info(`✅ Stock reservation created ID ${createRes.body.data.id}`);

  // 9. CREATE Batch Tracking
  logger.info('--- 8. CREATING BATCH & LOT TRACKING ---');
  const createBatch = await supertest(app)
    .post('/api/v1/store/inventory/batches')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      warehouseId,
      batchNumber: 'BATCH-2026-X9',
      lotNumber: 'LOT-9988',
    });

  if (createBatch.status !== 201) {
    throw new Error(`Failed to create batch: ${JSON.stringify(createBatch.body)}`);
  }
  logger.info(`✅ Batch created ID ${createBatch.body.data.id}`);

  // 10. CREATE Serial / IMEI Tracking
  logger.info('--- 9. CREATING SERIAL / IMEI TRACKING ---');
  const createSerial = await supertest(app)
    .post('/api/v1/store/inventory/serials')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      warehouseId,
      serialNumber: 'SN-998877665544',
      imei: '864201059988776',
    });

  if (createSerial.status !== 201) {
    throw new Error(`Failed to create serial: ${JSON.stringify(createSerial.body)}`);
  }
  logger.info(`✅ Serial created ID ${createSerial.body.data.id}`);

  // 11. CREATE Cycle Count Schedule
  logger.info('--- 10. CREATING CYCLE COUNT SCHEDULE ---');
  const createCC = await supertest(app)
    .post('/api/v1/store/inventory/cycle-counts')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      warehouseId,
      notes: 'Q3 Physical count schedule',
    });

  if (createCC.status !== 201) {
    throw new Error(`Failed to create cycle count: ${JSON.stringify(createCC.body)}`);
  }
  logger.info(`✅ Cycle count created ID ${createCC.body.data.id}`);

  logger.info('🎉 STORE INVENTORY MODULE QA VERIFICATION PASSED');
  process.exit(0);
}

runVerification().catch((error) => {
  logger.error(`❌ Store Inventory QA verification failed: ${error.message}`);
  logger.error(error.stack);
  process.exit(1);
});
