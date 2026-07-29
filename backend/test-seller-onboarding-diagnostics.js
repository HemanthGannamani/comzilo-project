require('dotenv').config();
const { Sequelize, QueryTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const { app } = require('./dist/app');

const seq = new Sequelize('comzilo_db', 'root', '', { host: 'localhost', dialect: 'mysql', logging: false });

async function runDiagnostic() {
  console.log('====================================================');
  console.log('SELLER ONBOARDING COMPLETE DIAGNOSTIC AUDIT');
  console.log('====================================================');

  const testEmail = 'hemanthgannamani@gmail.com';

  // 1. Clean previous test records for hemanthgannamani@gmail.com
  console.log(`\n[STEP 1] Cleaning up pre-existing records for ${testEmail}...`);
  await seq.query('DELETE FROM stores WHERE slug LIKE "%hemanth%"', { replacements: { testEmail } });
  await seq.query('DELETE FROM tenants WHERE slug LIKE "%hemanth%"', { replacements: { testEmail } });
  await seq.query('DELETE FROM marketing_email_queue WHERE recipient = :testEmail', { replacements: { testEmail } });
  await seq.query('DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE email = :testEmail)', { replacements: { testEmail } });
  await seq.query('DELETE FROM user_profiles WHERE user_id IN (SELECT id FROM users WHERE email = :testEmail)', { replacements: { testEmail } });
  await seq.query('DELETE FROM users WHERE email = :testEmail', { replacements: { testEmail } });
  await seq.query('DELETE FROM seller_applications WHERE email = :testEmail', { replacements: { testEmail } });

  // 2. Submit Seller Application
  console.log('\n[STEP 2] Submitting Seller Application...');
  const req = supertest(app);
  const appRes = await req.post('/api/v1/seller-applications').send({
    businessName: 'Hemanth Enterprise Store',
    ownerName: 'Hemanth Gannamani',
    email: testEmail,
    phone: '9876543210',
    businessType: 'Retail',
    gstNumber: '37AAAAA0000A1Z5',
    panNumber: 'ABCDE1234F',
    addressLine1: 'Road No 1, Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    postalCode: '500033',
    preferredStoreName: 'Hemanth Store',
    password: 'OriginalSellerPassword123!',
    confirmPassword: 'OriginalSellerPassword123!',
  });

  console.log(`Submit Application Response Code: ${appRes.status}`);
  if (appRes.status !== 201 && appRes.status !== 200) {
    console.error('Failed to submit application:', appRes.body);
    return;
  }
  const appRows = await seq.query('SELECT id FROM seller_applications WHERE email = :testEmail', { replacements: { testEmail }, type: QueryTypes.SELECT });
  const applicationId = appRows[0].id;
  console.log(`✅ Application Created! ID: ${applicationId}`);

  // 3. Approve Seller Application as Super Admin
  console.log(`\n[STEP 3] Approving Seller Application #${applicationId}...`);
  // Generate Super Admin JWT or call controller directly
  const jwt = require('jsonwebtoken');
  const adminToken = jwt.sign(
    { userId: 1, tenantId: 1, email: 'admin@comzilo.com', role: 'super_admin' },
    process.env.JWT_ACCESS_SECRET || 'your-super-secret-access-key-comzilo-2026'
  );

  const approveRes = await req
    .patch(`/api/v1/admin/seller-applications/${applicationId}/approve`)
    .set('Authorization', `Bearer ${adminToken}`);

  console.log(`Approve Application Response Code: ${approveRes.status}`);
  if (approveRes.status !== 200) {
    console.error('Failed to approve application:', approveRes.body);
    return;
  }

  console.log(`✅ Application Approved Successfully! Message: ${approveRes.body.message}`);

  // 4. Audit Email Queue Record
  console.log('\n[STEP 4] Auditing Emailed Credentials in marketing_email_queue...');
  const emailJobs = await seq.query(
    'SELECT * FROM marketing_email_queue WHERE recipient = :testEmail ORDER BY id DESC LIMIT 1',
    { replacements: { testEmail }, type: QueryTypes.SELECT }
  );

  if (emailJobs.length === 0) {
    console.error('❌ CRITICAL: No email job found in marketing_email_queue!');
    return;
  }

  const emailJob = emailJobs[0];
  const payload = JSON.parse(emailJob.payload_json);
  const emailedPassword = payload.temporaryPassword;
  console.log(`Emailed Recipient: ${emailJob.recipient}`);
  console.log(`Emailed Seller Name: ${payload.sellerName}`);
  console.log(`Emailed Store Name: ${payload.storeName}`);
  console.log(`Emailed Temp Password: "${emailedPassword}"`);

  // 5. Audit User Record in Database
  console.log('\n[STEP 5] Auditing User Record in `users` table...');
  const users = await seq.query(
    'SELECT * FROM users WHERE email = :testEmail AND deleted_at IS NULL',
    { replacements: { testEmail }, type: QueryTypes.SELECT }
  );

  if (users.length === 0) {
    console.error('❌ CRITICAL: No user record found in database!');
    return;
  }

  const user = users[0];
  console.log(`User ID: ${user.id}`);
  console.log(`Tenant ID: ${user.tenant_id}`);
  console.log(`Status: ${user.status}`);
  console.log(`Must Change Password: ${user.must_change_password}`);
  console.log(`Database Password Hash: ${user.password_hash}`);

  // 6. Compare Emailed Password vs Stored Password Hash
  console.log('\n[STEP 6] Comparing Emailed Password vs Database Password Hash...');
  const isMatchEmailed = await bcrypt.compare(emailedPassword, user.password_hash);
  console.log(`Bcrypt Compare (Emailed Password "${emailedPassword}"): ${isMatchEmailed ? '✅ MATCH' : '❌ MISMATCH'}`);

  const isMatchOriginal = await bcrypt.compare('OriginalSellerPassword123!', user.password_hash);
  console.log(`Bcrypt Compare (Original Reg Password "OriginalSellerPassword123!"): ${isMatchOriginal ? '✅ MATCH' : '❌ MISMATCH'}`);

  // 7. Audit Tenant and Store
  console.log('\n[STEP 7] Auditing Tenant, Store, and Roles...');
  const tenants = await seq.query('SELECT * FROM tenants WHERE id = :tId', {
    replacements: { tId: user.tenant_id },
    type: QueryTypes.SELECT,
  });
  console.log(`Tenant:`, tenants[0]);

  const stores = await seq.query('SELECT * FROM stores WHERE tenant_id = :tId', {
    replacements: { tId: user.tenant_id },
    type: QueryTypes.SELECT,
  });
  console.log(`Store:`, stores[0]);

  const roles = await seq.query(
    'SELECT ur.*, r.code as role_code, r.name as role_name FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = :uId',
    { replacements: { uId: user.id }, type: QueryTypes.SELECT }
  );
  console.log(`User Roles:`, roles);

  // 8. Test HTTP Login with Emailed Password
  console.log(`\n[STEP 8] Attempting HTTP Seller Login with Emailed Credentials...`);
  const loginResEmailed = await req.post('/api/v1/auth/login').send({
    email: testEmail,
    password: emailedPassword,
  });

  console.log(`Login Response Status (Emailed Password): ${loginResEmailed.status}`);
  if (loginResEmailed.status === 200) {
    console.log(`🎉 LOGIN SUCCESSFUL WITH EMAILED PASSWORD!`);
    console.log(`Access Token: ${loginResEmailed.body.data?.accessToken ? 'RECEIVED' : 'NONE'}`);
    console.log(`Tenant Slug: ${loginResEmailed.body.data?.tenant?.slug}`);
  } else {
    console.error(`❌ LOGIN FAILED (Emailed Password):`, JSON.stringify(loginResEmailed.body));
  }

  // 9. Test HTTP Login with Original Password
  console.log(`\n[STEP 9] Attempting HTTP Seller Login with Original Reg Password...`);
  const loginResOriginal = await req.post('/api/v1/auth/login').send({
    email: testEmail,
    password: 'OriginalSellerPassword123!',
  });

  console.log(`Login Response Status (Original Password): ${loginResOriginal.status}`);
  if (loginResOriginal.status === 200) {
    console.log(`🎉 LOGIN SUCCESSFUL WITH ORIGINAL REGISTRATION PASSWORD!`);
  } else {
    console.error(`❌ LOGIN FAILED (Original Password):`, JSON.stringify(loginResOriginal.body));
  }
}

runDiagnostic()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Diagnostic error:', err);
    process.exit(1);
  });
