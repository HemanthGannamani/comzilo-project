import { connectDatabase } from '../../config/database';
import app from '../../app';
import supertest from 'supertest';
import { User, Tenant, Store } from '../models';
import { sequelize } from '../../config/database';
import { logger } from '../../shared/logging/logger';

export const runAdminSellerVerify = async () => {
  try {
    await connectDatabase();

    logger.info('--- 1. ADMIN AUTHENTICATION ---');
    const adminLogin = await supertest(app)
      .post('/api/v1/auth/login')
      .set('Origin', 'http://localhost:5173')
      .send({ email: 'admin@comzilo.com', password: 'SuperAdminSecurePassword2026!' });

    const adminToken = adminLogin.body.data.accessToken;
    logger.info('Admin login successful.');

    logger.info('--- 2. CREATE SELLER WITH NEW TENANT AND STORE ---');
    const uniqueEmail = `manual.owner.${Date.now()}@example.com`;
    const uniquePhone = `+91998800${Math.floor(1000 + Math.random() * 9000)}`;
    const tenantSlug = `tenant-slug-${Date.now()}`;
    const storeCode = `store-code-${Date.now()}`;

    const createRes = await supertest(app)
      .post('/api/v1/admin/sellers')
      .set('Authorization', `Bearer ${adminToken}`)
      .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
      .send({
        ownerName: 'Manually Added Seller',
        email: uniqueEmail,
        phone: uniquePhone,
        password: 'SellerSecurePassword2026!',
        businessName: 'Direct Stores Inc',
        businessType: 'Retail',
        gstNumber: `29ABCDE${Math.floor(1000 + Math.random() * 9000)}F1Z9`,
        tenantConfig: {
          mode: 'create',
          newName: 'Direct Stores Inc',
          newSlug: tenantSlug,
          newStatus: 'active',
        },
        storeConfig: {
          mode: 'create',
          newName: 'Direct Outlet Alpha',
          newCode: storeCode,
          newStatus: 'active',
        },
        roleCode: 'tenant_owner',
        status: 'active',
      });

    logger.info(`Create Response Code: ${createRes.status}`);
    if (createRes.status !== 200) {
      logger.error(`Create seller response body: ${JSON.stringify(createRes.body, null, 2)}`);
      throw new Error('Failed to create seller');
    }

    const createdUserId = createRes.body.data?.id;
    logger.info(`Onboarded Seller User ID: ${createdUserId}`);

    logger.info('--- 3. DATABASE INTEGRITY CHECKS ---');
    const dbUser = await User.findByPk(createdUserId);
    if (!dbUser) throw new Error('User not found in MySQL database');

    const dbTenant = await Tenant.findOne({ where: { slug: tenantSlug } });
    if (!dbTenant) throw new Error('Tenant not provisioned in database');

    const dbStore = await Store.findOne({ where: { slug: storeCode } });
    if (!dbStore) throw new Error('Store not provisioned in database');

    logger.info('Direct provisioned database entities verified successfully.');

    logger.info('--- 4. FETCH SELLERS DIRECTORY LIST ---');
    const listRes = await supertest(app)
      .get('/api/v1/admin/sellers')
      .set('Authorization', `Bearer ${adminToken}`)
      .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

    logger.info(`List API Response Code: ${listRes.status}`);
    const sellers = listRes.body.data?.sellers;
    logger.info(`Total Sellers Found: ${listRes.body.data?.total}`);

    if (listRes.status !== 200 || !sellers || sellers.length === 0) {
      throw new Error('Failed to retrieve sellers list');
    }

    logger.info('--- 5. SUSPEND SELLER WORKFLOW ---');
    const suspendRes = await supertest(app)
      .patch(`/api/v1/admin/sellers/${createdUserId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
      .send({ status: 'suspended' });

    logger.info(`Status API Response Code: ${suspendRes.status}`);
    const updatedUser = await User.findByPk(createdUserId);
    if (updatedUser?.status !== 'suspended') {
      throw new Error('Seller status was not updated to suspended');
    }
    logger.info('Seller suspended state verified successfully in MySQL.');

    logger.info('--- 6. ROLE PROTECTION BLOCK CHECK (NON-ADMIN ROLE) ---');
    const sellerLogin = await supertest(app)
      .post('/api/v1/auth/login')
      .set('Origin', 'http://localhost:5173')
      .set('X-Tenant-UUID', '00000000-0000-0000-0000-00000000000a')
      .send({ email: 'seller1@abc.com', password: 'SellerSecurePassword2026!' });

    const sellerToken = sellerLogin.body.data.accessToken;

    const blockedRes = await supertest(app)
      .get('/api/v1/admin/sellers')
      .set('Authorization', `Bearer ${sellerToken}`)
      .set('X-Tenant-UUID', '00000000-0000-0000-0000-00000000000a');

    logger.info(`Blocked Non-Admin Request Status Code: ${blockedRes.status} (Expected: 403)`);
    if (blockedRes.status !== 403) {
      throw new Error('Access was not blocked for non-admin user');
    }

    logger.info('--- 7. AUDIT LOG VERIFICATION ---');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [auditLog]: any = await sequelize.query(
      `SELECT action, entity_type, entity_id FROM audit_logs WHERE entity_type = 'user' AND action = 'seller.created' ORDER BY id DESC LIMIT 1`
    );
    logger.info(`Audit Log Row: ${JSON.stringify(auditLog[0], null, 2)}`);

    logger.info('--- SELLER MANAGEMENT PHASE 1 DIRECT QA VERIFICATION PASSED ---');
  } catch (error) {
    logger.error('Admin seller direct QA verification failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  runAdminSellerVerify().then(() => process.exit(0));
}
