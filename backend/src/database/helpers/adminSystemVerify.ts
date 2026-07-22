/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from '../../app';
import supertest from 'supertest';
import { logger } from '../../shared/logging/logger';
import { connectDatabase } from '../../config/database';

async function runVerification() {
  await connectDatabase();
  logger.info('=== STARTING ADMIN SYSTEM ADMINISTRATION QA VERIFICATION ===');

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

  // 2. Verify System Settings
  logger.info('--- VERIFYING SYSTEM SETTINGS API ---');
  const getSettings = await supertest(app)
    .get('/api/v1/admin/settings')
    .set('Authorization', `Bearer ${adminToken}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getSettings.status !== 200) {
    throw new Error(`Failed to fetch settings: ${JSON.stringify(getSettings.body)}`);
  }
  logger.info('✅ Settings retrieval verified.');

  const saveSettings = await supertest(app)
    .post('/api/v1/admin/settings')
    .set('Authorization', `Bearer ${adminToken}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send([{ settingKey: 'app_name', settingValue: 'Verify SaaS ERP', category: 'general' }]);

  if (saveSettings.status !== 200) {
    throw new Error(`Failed to save settings: ${JSON.stringify(saveSettings.body)}`);
  }
  logger.info('✅ Settings upsert verified.');

  // 3. Verify Email Templates
  logger.info('--- VERIFYING EMAIL TEMPLATES API ---');
  const getTemplates = await supertest(app)
    .get('/api/v1/admin/email-templates')
    .set('Authorization', `Bearer ${adminToken}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getTemplates.status !== 200) {
    throw new Error(`Failed to fetch templates: ${JSON.stringify(getTemplates.body)}`);
  }
  logger.info('✅ Templates list verified.');

  const saveTemplate = await supertest(app)
    .post('/api/v1/admin/email-templates')
    .set('Authorization', `Bearer ${adminToken}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      code: 'verify_template',
      name: 'Verify Template',
      subject: 'Verify Subject',
      body: 'Dear {{sellerName}}, welcome.',
    });

  if (saveTemplate.status !== 200) {
    throw new Error(`Failed to save template: ${JSON.stringify(saveTemplate.body)}`);
  }
  logger.info('✅ Templates save verified.');

  // 4. Verify Notifications List
  logger.info('--- VERIFYING NOTIFICATIONS CENTER API ---');
  const getNotifs = await supertest(app)
    .get('/api/v1/admin/notifications')
    .set('Authorization', `Bearer ${adminToken}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getNotifs.status !== 200) {
    throw new Error(`Failed to fetch notifications: ${JSON.stringify(getNotifs.body)}`);
  }
  logger.info('✅ In-App Notifications retrieval verified.');

  // 5. Verify Backups List
  logger.info('--- VERIFYING BACKUPS MANAGEMENT API ---');
  const getBackups = await supertest(app)
    .get('/api/v1/admin/backups')
    .set('Authorization', `Bearer ${adminToken}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getBackups.status !== 200) {
    throw new Error(`Failed to fetch backups list: ${JSON.stringify(getBackups.body)}`);
  }
  logger.info('✅ Backups file list verified.');

  // 6. Verify System Health specs
  logger.info('--- VERIFYING SYSTEM HEALTH DETAILS API ---');
  const getHealth = await supertest(app)
    .get('/api/v1/admin/system-health')
    .set('Authorization', `Bearer ${adminToken}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getHealth.status !== 200) {
    throw new Error(`Failed to fetch system health details: ${JSON.stringify(getHealth.body)}`);
  }
  logger.info('✅ Health metrics verified.');

  // 7. Verify Audit logs raw queries
  logger.info('--- VERIFYING IMMUTABLE AUDIT VIEWER API ---');
  const getLogs = await supertest(app)
    .get('/api/v1/admin/audit-logs')
    .set('Authorization', `Bearer ${adminToken}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getLogs.status !== 200) {
    throw new Error(`Failed to fetch audit logs list: ${JSON.stringify(getLogs.body)}`);
  }
  logger.info('✅ Audit logs list verified.');

  logger.info('🎉 ADMIN SYSTEM ADMINISTRATION QA VERIFICATION PASSED');
  process.exit(0);
}

runVerification().catch((error) => {
  logger.error(`❌ System QA verification failed: ${error.message}`);
  logger.error(error.stack);
  process.exit(1);
});
