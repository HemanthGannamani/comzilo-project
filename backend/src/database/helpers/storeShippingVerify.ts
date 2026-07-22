/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from '../../app';
import supertest from 'supertest';
import { logger } from '../../shared/logging/logger';
import { connectDatabase } from '../../config/database';

async function runVerification() {
  await connectDatabase();
  logger.info('=== STARTING STORE SHIPPING MODULE QA VERIFICATION ===');

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

  // 2. CREATE Shipping Zone
  logger.info('--- 1. CREATING SHIPPING ZONE ---');
  const createZone = await supertest(app)
    .post('/api/v1/store/shipping/zones')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'North America Priority Zone',
      countries: ['USA', 'CAN', 'MEX'],
      priority: 1,
    });

  if (createZone.status !== 201) {
    throw new Error(`Failed to create zone: ${JSON.stringify(createZone.body)}`);
  }
  const zoneId = createZone.body.data.id;
  logger.info(`✅ Shipping Zone created ID ${zoneId}`);

  // 3. CREATE Shipping Method & Rate
  logger.info('--- 2. CREATING SHIPPING METHOD & RATE ---');
  const createMethod = await supertest(app)
    .post('/api/v1/store/shipping/methods')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      zoneId,
      name: 'Express Ground Delivery',
      code: 'EXPRESS-GROUND',
      type: 'express',
      rate: 18.5,
      estimatedDays: 2,
    });

  if (createMethod.status !== 201) {
    throw new Error(`Failed to create method: ${JSON.stringify(createMethod.body)}`);
  }
  logger.info(`✅ Shipping Method created ID ${createMethod.body.data.id}`);

  // 4. FETCH Shipping Zones with Methods
  logger.info('--- 3. FETCHING ZONES LIST ---');
  const getZones = await supertest(app)
    .get('/api/v1/store/shipping/zones')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getZones.status !== 200 || !Array.isArray(getZones.body.data)) {
    throw new Error(`Failed to fetch zones: ${JSON.stringify(getZones.body)}`);
  }
  logger.info('✅ Zones list with rates fetched successfully.');

  // 5. CREATE Shipping Carrier
  logger.info('--- 4. CREATING SHIPPING CARRIER ---');
  const createCarrier = await supertest(app)
    .post('/api/v1/store/shipping/carriers')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'FedEx Express Freight',
      code: 'fedex_express',
      trackingUrlTemplate: 'https://fedex.com/tracking?num={tracking_number}',
    });

  if (createCarrier.status !== 201) {
    throw new Error(`Failed to create carrier: ${JSON.stringify(createCarrier.body)}`);
  }
  const carrierId = createCarrier.body.data.id;
  logger.info(`✅ Shipping Carrier created ID ${carrierId}`);

  // 6. CREATE Order & Shipment
  logger.info('--- 5. CREATING ORDER & SHIPMENT ---');
  const ordRes = await supertest(app)
    .post('/api/v1/store/orders')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      customerEmail: 'shipping_test@comzilo.com',
      items: [{ productId: 1, variantId: 1, price: 50.0, quantity: 1 }],
    });

  const validOrderId = ordRes.body.data.id;

  const createShipment = await supertest(app)
    .post('/api/v1/store/shipping/shipments')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      orderId: validOrderId,
      carrier: 'FedEx Express Freight',
      trackingNumber: `FDX-${Date.now()}`,
      shippingCost: 18.5,
    });

  if (createShipment.status !== 201) {
    throw new Error(`Failed to create shipment: ${JSON.stringify(createShipment.body)}`);
  }
  const shipmentId = createShipment.body.data.id;
  logger.info(`✅ Shipment created ID ${shipmentId}`);

  // 7. FETCH Shipments List
  logger.info('--- 6. FETCHING SHIPMENTS LIST ---');
  const getShipments = await supertest(app)
    .get('/api/v1/store/shipping/shipments')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getShipments.status !== 200 || !getShipments.body.data.shipments) {
    throw new Error(`Failed to fetch shipments: ${JSON.stringify(getShipments.body)}`);
  }
  logger.info(`✅ Shipments list fetched total ${getShipments.body.data.total}`);

  // 8. UPDATE Shipment Status to In Transit
  logger.info('--- 7. ADVANCING SHIPMENT STATUS TO IN TRANSIT ---');
  const updateShip = await supertest(app)
    .patch(`/api/v1/store/shipping/shipments/${shipmentId}/status`)
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      status: 'in_transit',
      location: 'Memphis Sorting Hub, TN',
      description: 'Package scanned at carrier regional sorting hub',
    });

  if (updateShip.status !== 200) {
    throw new Error(`Failed to update shipment status: ${JSON.stringify(updateShip.body)}`);
  }
  logger.info('✅ Shipment status updated to in_transit with tracking event.');

  // 9. SCHEDULE Carrier Pickup
  logger.info('--- 8. SCHEDULING CARRIER PICKUP ---');
  const schedPickup = await supertest(app)
    .post('/api/v1/store/shipping/pickups')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      warehouseId: 1,
      carrierId,
      pickupDate: '2026-08-01',
      pickupTime: '09:00 AM - 01:00 PM',
    });

  if (schedPickup.status !== 201) {
    throw new Error(`Failed to schedule pickup: ${JSON.stringify(schedPickup.body)}`);
  }
  logger.info(`✅ Carrier pickup scheduled ID ${schedPickup.body.data.id}`);

  logger.info('🎉 STORE SHIPPING MODULE QA VERIFICATION PASSED');
  process.exit(0);
}

runVerification().catch((error) => {
  logger.error(`❌ Store Shipping QA verification failed: ${error.message}`);
  logger.error(error.stack);
  process.exit(1);
});
