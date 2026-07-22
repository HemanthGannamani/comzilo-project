/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from '../../app';
import supertest from 'supertest';
import { logger } from '../../shared/logging/logger';
import { connectDatabase } from '../../config/database';

async function runVerification() {
  await connectDatabase();
  logger.info('=== STARTING PUBLIC SELLER REGISTRATION QA VERIFICATION ===');

  const testEmail = `zenith.seller.${Date.now()}@example.com`;
  const testGst = `GST${Date.now().toString().slice(-10)}`;

  // 1. PUBLIC SELLER REGISTRATION SUBMISSION
  logger.info('--- 1. SUBMITTING PUBLIC SELLER REGISTRATION ---');
  const regRes = await supertest(app).post('/api/v1/public/seller/register').send({
    businessName: 'Zenith Retail Enterprise Ltd',
    businessType: 'Retail',
    preferredStoreName: 'Zenith Store',
    ownerName: 'Alexander Vance',
    email: testEmail,
    phone: '+18005559988',
    gstNumber: testGst,
    panNumber: 'ZENITH9900',
    addressLine1: '450 Innovation Way',
    city: 'Seattle',
    state: 'Washington',
    country: 'United States',
    postalCode: '98101',
    password: 'SellerSecurePass2026!',
    confirmPassword: 'SellerSecurePass2026!',
  });

  if (regRes.status !== 201) {
    throw new Error(`Public seller registration failed: ${JSON.stringify(regRes.body)}`);
  }
  const appNumber = regRes.body.data.applicationNumber;
  logger.info(
    `✅ Public Seller Registration submitted successfully! (Application Number: ${appNumber})`
  );

  // 2. CHECK APPLICATION STATUS API
  logger.info('--- 2. CHECKING APPLICATION STATUS VIA PUBLIC API ---');
  const statusRes = await supertest(app).get(
    `/api/v1/public/seller-applications/status/${appNumber}`
  );

  if (statusRes.status !== 200 || statusRes.body.data.status !== 'Pending') {
    throw new Error(`Application status lookup failed: ${JSON.stringify(statusRes.body)}`);
  }
  logger.info(`✅ Public Application Status Lookup returned status: ${statusRes.body.data.status}`);

  // 3. VERIFY DUPLICATE EMAIL VALIDATION
  logger.info('--- 3. VERIFYING DUPLICATE EMAIL REJECTION ---');
  const dupRes = await supertest(app).post('/api/v1/public/seller/register').send({
    businessName: 'Duplicate Zenith Ltd',
    businessType: 'Retail',
    preferredStoreName: 'Zenith Store 2',
    ownerName: 'Alexander Vance',
    email: testEmail,
    phone: '+18005559989',
    addressLine1: '450 Innovation Way',
    city: 'Seattle',
    state: 'Washington',
    country: 'United States',
    postalCode: '98101',
    password: 'SellerSecurePass2026!',
    confirmPassword: 'SellerSecurePass2026!',
  });

  if (dupRes.status !== 409) {
    throw new Error(
      `Duplicate email check failed, expected 409 Conflict but received ${dupRes.status}`
    );
  }
  logger.info('✅ Duplicate email validation correctly rejected submission (409 Conflict).');

  // 4. SUPER ADMIN APPROVAL LIFECYCLE
  logger.info('--- 4. EXECUTING SUPER ADMIN APPROVAL WORKFLOW ---');
  const loginRes = await supertest(app)
    .post('/api/v1/auth/login')
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      email: 'admin@comzilo.com',
      password: 'SuperAdminSecurePassword2026!',
    });

  const adminToken = loginRes.body.data.accessToken;

  // Get application database ID
  const listApps = await supertest(app)
    .get('/api/v1/admin/seller-applications')
    .set('Authorization', `Bearer ${adminToken}`);

  const appsList = Array.isArray(listApps.body.data)
    ? listApps.body.data
    : listApps.body.data?.rows ||
      listApps.body.data?.items ||
      listApps.body.data?.applications ||
      [];

  const targetApp = appsList.find((item: any) => item.applicationNumber === appNumber);

  if (!targetApp) {
    throw new Error(`Application ${appNumber} not visible in Super Admin Seller Applications view`);
  }
  logger.info(
    `✅ Registered application ${appNumber} automatically visible in Super Admin panel (App ID: ${targetApp.id})`
  );

  const approveRes = await supertest(app)
    .patch(`/api/v1/admin/seller-applications/${targetApp.id}/approve`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      reviewNotes: 'Verified corporate registration and tax status. Application approved.',
    });

  if (approveRes.status !== 200) {
    throw new Error(`Admin approval failed: ${JSON.stringify(approveRes.body)}`);
  }
  logger.info(
    `✅ Super Admin approved application! (Tenant ID: ${approveRes.body.data.tenantId}, Store ID: ${approveRes.body.data.storeId}, Seller User ID: ${approveRes.body.data.userId})`
  );

  // 5. STATUS RE-CHECK AFTER APPROVAL
  const statusAfterApprove = await supertest(app).get(
    `/api/v1/public/seller-applications/status/${appNumber}`
  );
  if (statusAfterApprove.body.data.status !== 'Approved') {
    throw new Error(
      `Status after approval check failed, expected 'Approved' but got ${statusAfterApprove.body.data.status}`
    );
  }
  logger.info('✅ Public Application Status updated to Approved after Super Admin review.');

  logger.info('🎉 PUBLIC SELLER REGISTRATION MODULE QA VERIFICATION PASSED');
  process.exit(0);
}

runVerification().catch((error) => {
  logger.error(`❌ Public Seller Registration QA verification failed: ${error.message}`);
  logger.error(error.stack);
  process.exit(1);
});
