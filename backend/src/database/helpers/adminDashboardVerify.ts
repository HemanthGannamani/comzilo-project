/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from '../../app';
import supertest from 'supertest';
import { logger } from '../../shared/logging/logger';
import { connectDatabase } from '../../config/database';

async function runVerification() {
  await connectDatabase();
  logger.info('=== STARTING ADMIN DASHBOARD & REPORTS QA VERIFICATION ===');

  // 1. Authenticate Platform Admin
  const adminRes = await supertest(app)
    .post('/api/v1/auth/login')
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      email: 'admin@comzilo.com',
      password: 'SuperAdminSecurePassword2026!',
    });

  const adminToken = adminRes.body.data.accessToken;
  logger.info('Platform Admin authenticated successfully.');

  // 2. Fetch Dashboard Metrics
  logger.info('--- VERIFYING DASHBOARD METRICS API ---');
  const dashboardRes = await supertest(app)
    .get('/api/v1/admin/dashboard')
    .set('Authorization', `Bearer ${adminToken}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (dashboardRes.status !== 200) {
    throw new Error(`Failed to fetch dashboard metrics: ${JSON.stringify(dashboardRes.body)}`);
  }

  const { summary, growth, tenants, stores, activities } = dashboardRes.body.data;
  if (!summary || !growth || !tenants || !stores || !activities) {
    throw new Error('Dashboard response missing required metrics components');
  }

  logger.info('✅ Dashboard aggregated metrics verified successfully.');

  // 3. Verify Reports APIs
  logger.info('--- VERIFYING REPORTS APIS ---');
  const reports = ['sellers', 'applications', 'tenants', 'stores'];
  for (const rep of reports) {
    const repRes = await supertest(app)
      .get(`/api/v1/admin/reports/${rep}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

    if (repRes.status !== 200) {
      throw new Error(`Failed to fetch ${rep} report: ${JSON.stringify(repRes.body)}`);
    }

    if (!Array.isArray(repRes.body.data)) {
      throw new Error(`Expected report response data to be an array for ${rep}`);
    }
    logger.info(`✅ Report: ${rep} returns clean list array.`);
  }

  // 4. Verify RBAC Security (403 Protection)
  logger.info('--- VERIFYING RBAC SECURITY (403 BLOCKER) ---');
  const sellerLogin = await supertest(app)
    .post('/api/v1/auth/login')
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      email: 'seller1@abc.com',
      password: 'InitialPassword123!',
    });

  const sellerToken = sellerLogin.body.data?.accessToken;
  if (sellerToken) {
    const unauthorizedRes = await supertest(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${sellerToken}`)
      .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

    if (unauthorizedRes.status !== 403) {
      throw new Error(`Expected 403 Forbidden for non-admin, got: ${unauthorizedRes.status}`);
    }
    logger.info('✅ Non-admin user blocked correctly with 403 Forbidden.');
  }

  logger.info('🎉 ADMIN DASHBOARD & REPORTS QA VERIFICATION PASSED');
  process.exit(0);
}

runVerification().catch((error) => {
  logger.error(`❌ Dashboard QA verification failed: ${error.message}`);
  logger.error(error.stack);
  process.exit(1);
});
