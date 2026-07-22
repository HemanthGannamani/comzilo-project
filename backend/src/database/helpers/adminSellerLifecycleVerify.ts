/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from '../../app';
import supertest from 'supertest';
import { User, Tenant, Store, Notification } from '../models';
import { logger } from '../../shared/logging/logger';
import { AuthService } from '../../services/auth.service';
import { connectDatabase, sequelize } from '../../config/database';
import { v4 as uuidv4 } from 'uuid';

async function runVerification() {
  await connectDatabase();
  logger.info('=== STARTING SELLER LIFECYCLE QA VERIFICATION ===');

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

  // Create a tenant & store first
  const ts = Date.now();
  const tenant = await Tenant.create({
    uuid: uuidv4(),
    name: `Lifecycle Tenant ${ts}`,
    slug: `lifecycle-tenant-${ts}`,
    plan: 'Enterprise',
    status: 'active',
  });

  const store = await Store.create({
    tenantId: tenant.id,
    name: `Lifecycle Store ${ts}`,
    code: `lifecycle-store-${ts}`,
    slug: `lifecycle-store-${ts}`,
    status: 'active',
  });

  // 2. Create a test seller using Onboarding
  const uniqueEmail = `lifecycle-seller-${Date.now()}@comzilo.com`;
  const registerRes = await supertest(app)
    .post('/api/v1/admin/sellers')
    .set('Authorization', `Bearer ${adminToken}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      ownerName: 'Lifecycle Owner',
      email: uniqueEmail,
      phone: '1234567890',
      password: 'InitialPassword123!',
      businessName: 'Lifecycle Business',
      businessType: 'Retail',
      gstNumber: '36AAAAA1111A1Z1',
      panNumber: 'ABCDE1234F',
      addressLine1: 'Hills Road',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      postalCode: '500034',
      tenantConfig: {
        mode: 'assign',
        tenantId: tenant.id,
      },
      storeConfig: {
        mode: 'assign',
        storeId: store.id,
      },
      roleCode: 'tenant_owner',
    });

  if (registerRes.status !== 200) {
    throw new Error(`Failed to provision seller: ${JSON.stringify(registerRes.body)}`);
  }

  const seller = registerRes.body.data;
  const sellerId = seller.id;
  logger.info(`Test Seller account created. ID: ${sellerId}`);

  // 3. FEATURE 2: Edit Seller Profile
  logger.info('--- VERIFYING EDIT SELLER ---');
  const editRes = await supertest(app)
    .patch(`/api/v1/admin/sellers/${sellerId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      ownerName: 'Updated Lifecycle Owner',
      phone: '9876543210',
      businessName: 'Updated Lifecycle Business',
      gstNumber: '36BBBBB2222B2Z2',
      panNumber: 'FGHIJ5678K',
    });

  if (editRes.status !== 200) {
    throw new Error(`Edit seller failed: ${JSON.stringify(editRes.body)}`);
  }
  logger.info('Edit seller properties updated successfully.');

  // 4. FEATURE 3 & 4: Suspend & Activate Seller
  logger.info('--- VERIFYING SUSPEND SELLER ---');
  const suspendRes = await supertest(app)
    .patch(`/api/v1/admin/sellers/${sellerId}/suspend`)
    .set('Authorization', `Bearer ${adminToken}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({ reason: 'Suspended for verification auditing' });

  if (suspendRes.status !== 200) {
    throw new Error(`Suspend seller failed: ${JSON.stringify(suspendRes.body)}`);
  }

  // Verify login blocks suspended seller
  const authService = new AuthService();
  try {
    await authService.login(
      tenant.id,
      { email: uniqueEmail, password: 'InitialPassword123!' },
      { ip: '127.0.0.1', userAgent: 'test' }
    );
    throw new Error('Login should have failed for suspended user');
  } catch (err: any) {
    if (err.message.includes('inactive, disabled or suspended')) {
      logger.info('✅ Suspended user login blocked correctly.');
    } else {
      throw err;
    }
  }

  logger.info('--- VERIFYING ACTIVATE SELLER ---');
  const activateRes = await supertest(app)
    .patch(`/api/v1/admin/sellers/${sellerId}/activate`)
    .set('Authorization', `Bearer ${adminToken}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send();

  if (activateRes.status !== 200) {
    throw new Error(`Activate seller failed: ${JSON.stringify(activateRes.body)}`);
  }

  // Verify login succeeds for active seller
  const activeLogin = await authService.login(
    tenant.id,
    { email: uniqueEmail, password: 'InitialPassword123!' },
    { ip: '127.0.0.1', userAgent: 'test' }
  );
  if (!activeLogin.accessToken) {
    throw new Error('Login failed after activating user');
  }
  logger.info('✅ Seller login working again after activation.');

  // 5. FEATURE 5: Reset Password
  logger.info('--- VERIFYING RESET PASSWORD ---');
  const resetRes = await supertest(app)
    .patch(`/api/v1/admin/sellers/${sellerId}/reset-password`)
    .set('Authorization', `Bearer ${adminToken}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send();

  if (resetRes.status !== 200) {
    throw new Error(`Reset password failed: ${JSON.stringify(resetRes.body)}`);
  }

  const tempPassword = resetRes.body.data.temporaryPassword;
  if (!tempPassword) {
    throw new Error('Temporary password not returned');
  }
  logger.info(`Temporary password generated: ${tempPassword}`);

  // Verify login works with temporary password
  const tempLogin = await authService.login(
    tenant.id,
    { email: uniqueEmail, password: tempPassword },
    { ip: '127.0.0.1', userAgent: 'test' }
  );
  if (!tempLogin.accessToken) {
    throw new Error('Login failed with temporary password');
  }
  logger.info('✅ Seller login successful using temporary password.');

  // 6. FEATURE 6: Soft Delete
  logger.info('--- VERIFYING SOFT DELETE ---');
  const deleteRes = await supertest(app)
    .delete(`/api/v1/admin/sellers/${sellerId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send();

  if (deleteRes.status !== 200) {
    throw new Error(`Delete seller failed: ${JSON.stringify(deleteRes.body)}`);
  }

  const checkDb = await User.findByPk(sellerId);
  if (checkDb !== null) {
    throw new Error('User should not be returned by standard findByPk after soft delete');
  }

  // Include soft deleted lookup
  const deletedCheck = await User.findByPk(sellerId, { paranoid: false });
  if (!deletedCheck || !deletedCheck.deletedAt) {
    throw new Error('User was not soft deleted (deleted_at is missing)');
  }
  logger.info('✅ Soft delete verified (paranoid entry found with deleted_at).');

  // Try to login as deleted user
  try {
    await authService.login(
      tenant.id,
      { email: uniqueEmail, password: tempPassword },
      { ip: '127.0.0.1', userAgent: 'test' }
    );
    throw new Error('Login should have failed for soft-deleted user');
  } catch (err: any) {
    if (err.message.includes('Invalid email or password')) {
      logger.info('✅ Soft-deleted login blocked correctly.');
    } else {
      throw err;
    }
  }

  // 7. FEATURE 8: Audit Logs Validation
  logger.info('--- VERIFYING AUDIT LOGS ---');
  const [logs]: any[] = await sequelize.query(
    'SELECT action FROM audit_logs WHERE entity_id = :entityId',
    {
      replacements: { entityId: String(sellerId) },
    }
  );

  const actions = logs.map((l: any) => l.action);
  logger.info(`Audit Log actions recorded: ${JSON.stringify(actions)}`);

  const requiredActions = [
    'seller.updated',
    'seller.suspended',
    'seller.activated',
    'password.reset',
    'seller.deleted',
  ];
  for (const act of requiredActions) {
    if (!actions.includes(act)) {
      throw new Error(`Missing expected audit log action: ${act}`);
    }
  }
  logger.info('✅ All lifecycle audit log actions verified.');

  // 8. FEATURE 7: Email Notifications Validation
  logger.info('--- VERIFYING EMAIL NOTIFICATIONS ---');
  const notifications = await Notification.findAll({
    where: { userId: sellerId },
  });

  logger.info(`Total email notifications sent: ${notifications.length}`);
  if (notifications.length < 4) {
    throw new Error(`Expected at least 4 notifications, found: ${notifications.length}`);
  }
  logger.info('✅ Email notification logs verified successfully.');

  logger.info('🎉 SELLER LIFECYCLE QA VERIFICATION PASSED');
  process.exit(0);
}

runVerification().catch((error) => {
  logger.error(`❌ Seller lifecycle QA verification failed: ${error.message}`);
  logger.error(error.stack);
  process.exit(1);
});
