/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from '../../app';
import supertest from 'supertest';
import { logger } from '../../shared/logging/logger';
import { connectDatabase } from '../../config/database';

async function runVerification() {
  await connectDatabase();
  logger.info('=== STARTING STORE ANALYTICS MODULE QA VERIFICATION ===');

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

  // 2. GET EXECUTIVE DASHBOARD & KPIS
  logger.info('--- 1. FETCHING EXECUTIVE BI DASHBOARD ---');
  const getDash = await supertest(app)
    .get('/api/v1/store/analytics/dashboard')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getDash.status !== 200) {
    throw new Error(`Failed to fetch dashboard: ${JSON.stringify(getDash.body)}`);
  }
  logger.info(`✅ Executive Dashboard KPIs loaded (${getDash.body.data.kpis.length} metric cards)`);

  // 3. GET DOMAIN ANALYTICS (SALES, INVENTORY, FINANCE, CUSTOMERS)
  logger.info('--- 2. FETCHING DOMAIN ANALYTICS DEEP DIVES ---');
  const getSales = await supertest(app)
    .get('/api/v1/store/analytics/sales')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getSales.status !== 200) {
    throw new Error(`Failed to fetch sales analytics: ${JSON.stringify(getSales.body)}`);
  }
  logger.info(
    `✅ Sales Analytics loaded (AOV: $${getSales.body.data.averageOrderValue.toFixed(2)})`
  );

  const getInv = await supertest(app)
    .get('/api/v1/store/analytics/inventory')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getInv.status !== 200) {
    throw new Error(`Failed to fetch inventory analytics: ${JSON.stringify(getInv.body)}`);
  }
  logger.info(`✅ Inventory Analytics loaded (Turnover: ${getInv.body.data.stockTurnoverRatio}x)`);

  const getFin = await supertest(app)
    .get('/api/v1/store/analytics/finance')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getFin.status !== 200) {
    throw new Error(`Failed to fetch finance analytics: ${JSON.stringify(getFin.body)}`);
  }
  logger.info(`✅ Finance Analytics loaded (Margin: ${getFin.body.data.grossProfitMargin}%)`);

  const getCust = await supertest(app)
    .get('/api/v1/store/analytics/customers')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getCust.status !== 200) {
    throw new Error(`Failed to fetch customer analytics: ${JSON.stringify(getCust.body)}`);
  }
  logger.info(
    `✅ Customer Analytics loaded (Retention Rate: ${getCust.body.data.retentionRatePercentage}%)`
  );

  // 4. GET PREDICTIVE FORECASTING MODEL
  logger.info('--- 3. GENERATING PREDICTIVE FORECAST MODEL ---');
  const getFc = await supertest(app)
    .get('/api/v1/store/analytics/forecast')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getFc.status !== 200) {
    throw new Error(`Failed to fetch forecast: ${JSON.stringify(getFc.body)}`);
  }
  logger.info(
    `✅ Predictive 6-Month Revenue Forecast generated (Accuracy: ${getFc.body.data.accuracyScore}%)`
  );

  // 5. CUSTOM REPORT BUILDER & EXPORT
  logger.info('--- 4. CUSTOM REPORT BUILDER & CSV EXPORT ---');
  const createRep = await supertest(app)
    .post('/api/v1/store/analytics/reports')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'Q3 Sales Performance & Margin Report',
      reportType: 'sales',
      filters: { region: 'North America', minAmount: 100 },
      fields: ['orderId', 'totalAmount', 'createdAt'],
    });

  if (createRep.status !== 201) {
    throw new Error(`Failed to create saved report: ${JSON.stringify(createRep.body)}`);
  }
  logger.info(`✅ Custom Saved Report created ID ${createRep.body.data.id}`);

  const getExport = await supertest(app)
    .get('/api/v1/store/analytics/export?type=sales')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getExport.status !== 200) {
    throw new Error(`Failed to export analytics: ${JSON.stringify(getExport.body)}`);
  }
  logger.info(`✅ Analytics CSV data stream exported (${getExport.body.data.fileName})`);

  logger.info('🎉 STORE ANALYTICS MODULE QA VERIFICATION PASSED');
  process.exit(0);
}

runVerification().catch((error) => {
  logger.error(`❌ Store Analytics QA verification failed: ${error.message}`);
  logger.error(error.stack);
  process.exit(1);
});
