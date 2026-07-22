import { connectDatabase } from '../../config/database';
import app from '../../app';
import supertest from 'supertest';
import { SellerApplication } from '../models';
import { sequelize } from '../../config/database';
import { logger } from '../../shared/logging/logger';

export const runAdminSellerApplicationVerify = async () => {
  try {
    await connectDatabase();

    logger.info('--- 1. ADMIN AUTHENTICATION ---');
    const adminLogin = await supertest(app)
      .post('/api/v1/auth/login')
      .set('Origin', 'http://localhost:5173')
      .send({ email: 'admin@comzilo.com', password: 'SuperAdminSecurePassword2026!' });

    const adminToken = adminLogin.body.data.accessToken;
    logger.info('Admin login successful.');

    logger.info('--- 2. FETCH SELLER APPLICATIONS LIST ---');
    const listRes = await supertest(app)
      .get('/api/v1/admin/seller-applications')
      .set('Authorization', `Bearer ${adminToken}`)
      .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

    logger.info(`List API Response Code: ${listRes.status}`);
    const applications = listRes.body.data?.applications;
    logger.info(`Total Applications Found: ${listRes.body.data?.total}`);

    if (listRes.status !== 200 || !applications || applications.length === 0) {
      throw new Error('Failed to retrieve seller applications or list is empty');
    }

    const testApp = applications[0];
    logger.info(
      `Selected Application for Review: ${testApp.applicationNumber} (ID: ${testApp.id})`
    );

    logger.info('--- 3. FETCH SINGLE SELLER APPLICATION ---');
    const getRes = await supertest(app)
      .get(`/api/v1/admin/seller-applications/${testApp.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

    logger.info(`Single GET API Response Code: ${getRes.status}`);
    if (getRes.status !== 200) {
      throw new Error('Failed to retrieve single seller application');
    }

    logger.info('--- 4. TEST REJECTION WORKFLOW ---');
    const rejectRes = await supertest(app)
      .patch(`/api/v1/admin/seller-applications/${testApp.id}/reject`)
      .set('Authorization', `Bearer ${adminToken}`)
      .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
      .send({ reason: 'Invalid or incomplete business license document provided.' });

    logger.info(`Reject API Response Code: ${rejectRes.status}`);
    if (rejectRes.status !== 200) {
      throw new Error('Reject application endpoint failed');
    }

    // Verify DB
    const dbApp = await SellerApplication.findByPk(testApp.id);
    if (
      dbApp?.status === 'Rejected' &&
      dbApp.reviewNotes === 'Invalid or incomplete business license document provided.'
    ) {
      logger.info('Rejection verified successfully in MySQL database.');
    } else {
      throw new Error('MySQL update mismatch after rejection');
    }

    logger.info('--- 5. ROLE AUTHORIZATION BLOCK CHECK (NON-ADMIN ROLE) ---');
    const sellerLogin = await supertest(app)
      .post('/api/v1/auth/login')
      .set('Origin', 'http://localhost:5173')
      .set('X-Tenant-UUID', '00000000-0000-0000-0000-00000000000a')
      .send({ email: 'seller1@abc.com', password: 'SellerSecurePassword2026!' });

    const sellerToken = sellerLogin.body.data.accessToken;

    const blockedRes = await supertest(app)
      .get('/api/v1/admin/seller-applications')
      .set('Authorization', `Bearer ${sellerToken}`)
      .set('X-Tenant-UUID', '00000000-0000-0000-0000-00000000000a');

    logger.info(`Blocked Non-Admin Request Status Code: ${blockedRes.status} (Expected: 403)`);
    if (blockedRes.status !== 403) {
      throw new Error('Access was not blocked for non-admin user');
    }

    logger.info('--- 6. AUDIT LOG VERIFICATION ---');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [auditLog]: any = await sequelize.query(
      `SELECT action, entity_type, entity_id FROM audit_logs WHERE entity_type = 'seller_application' AND action = 'seller_application.rejected' ORDER BY id DESC LIMIT 1`
    );
    logger.info(`Audit Log Row: ${JSON.stringify(auditLog[0], null, 2)}`);

    logger.info('--- SELLER APPLICATION PHASE 2 ADMIN REVIEW QA VERIFICATION PASSED ---');
  } catch (error) {
    logger.error('Admin seller application verification failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  runAdminSellerApplicationVerify().then(() => process.exit(0));
}
