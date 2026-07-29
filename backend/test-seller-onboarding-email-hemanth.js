require('dotenv').config();
const { Sequelize, QueryTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const { app } = require('./dist/app');

const seq = new Sequelize('comzilo_db', 'root', '', { host: 'localhost', dialect: 'mysql', logging: false });

async function runLiveEmailAudit() {
  const testEmail = 'hemanthgannamani@gmail.com';

  console.log('\n====================================================');
  console.log(`LIVE SELLER ONBOARDING FORENSIC AUDIT: ${testEmail}`);
  console.log('====================================================\n');

  // STEP 1: Clean pre-existing test records for hemanthgannamani@gmail.com
  console.log(`[STEP 1] Cleaning pre-existing database records for ${testEmail}...`);
  await seq.query('DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE email = :testEmail) OR tenant_id IN (SELECT id FROM tenants WHERE slug LIKE "%hemanth%")', { replacements: { testEmail } });
  await seq.query('DELETE FROM user_profiles WHERE user_id IN (SELECT id FROM users WHERE email = :testEmail) OR tenant_id IN (SELECT id FROM tenants WHERE slug LIKE "%hemanth%")', { replacements: { testEmail } });
  await seq.query('DELETE FROM users WHERE email = :testEmail OR tenant_id IN (SELECT id FROM tenants WHERE slug LIKE "%hemanth%")', { replacements: { testEmail } });
  await seq.query('DELETE FROM stores WHERE slug LIKE "%hemanth%" OR tenant_id IN (SELECT id FROM tenants WHERE slug LIKE "%hemanth%")', { replacements: { testEmail } });
  await seq.query('DELETE FROM tenants WHERE slug LIKE "%hemanth%"', { replacements: { testEmail } });
  await seq.query('DELETE FROM marketing_email_queue WHERE recipient = :testEmail', { replacements: { testEmail } });
  await seq.query('DELETE FROM seller_applications WHERE email = :testEmail', { replacements: { testEmail } });

  // STEP 2: Submit Seller Application via API
  console.log('\n[STEP 2] Submitting Seller Application via HTTP API...');
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

  console.log(`Submit Application Status Code: ${appRes.status}`);
  if (appRes.status !== 201) {
    console.error('Failed to submit application:', appRes.body);
    return;
  }

  const appRows = await seq.query('SELECT id FROM seller_applications WHERE email = :testEmail', {
    replacements: { testEmail },
    type: QueryTypes.SELECT,
  });
  const applicationId = appRows[0].id;
  console.log(`✅ Application Created! ID: ${applicationId}`);

  // STEP 3: Approve Application as Super Admin
  console.log(`\n[STEP 3] Approving Application #${applicationId} as Super Admin...`);
  const jwt = require('jsonwebtoken');
  const adminToken = jwt.sign(
    { userId: 1, tenantId: 1, email: 'admin@comzilo.com', role: 'super_admin' },
    process.env.JWT_ACCESS_SECRET || 'your-super-secret-access-key-comzilo-2026'
  );

  const approveRes = await req
    .patch(`/api/v1/admin/seller-applications/${applicationId}/approve`)
    .set('Authorization', `Bearer ${adminToken}`);

  console.log(`Approve Application Status Code: ${approveRes.status}`);
  if (approveRes.status !== 200) {
    console.error('Failed to approve application:', approveRes.body);
    return;
  }
  console.log(`✅ Application Approved Successfully! Message: ${approveRes.body.message}`);

  // STEP 4: Audit Email Queue & Gmail SMTP Dispatch
  console.log('\n[STEP 4] Auditing Emailed Credentials in marketing_email_queue...');
  const emailJobs = await seq.query(
    'SELECT * FROM marketing_email_queue WHERE recipient = :testEmail ORDER BY id DESC LIMIT 1',
    { replacements: { testEmail }, type: QueryTypes.SELECT }
  );

  const emailJob = emailJobs[0];
  const payload = JSON.parse(emailJob.payload_json);
  const emailedPassword = payload.temporaryPassword;

  console.log(`Recipient Email: ${emailJob.recipient}`);
  console.log(`Emailed Seller Name: ${payload.sellerName}`);
  console.log(`Emailed Store Name: ${payload.storeName}`);
  console.log(`Emailed Temporary Password: "${emailedPassword}"`);

  // STEP 5: Audit Database User State & Bcrypt Compare
  console.log('\n[STEP 5] Auditing Database User Record & Bcrypt Password Comparison...');
  const users = await seq.query(
    'SELECT * FROM users WHERE email = :testEmail AND deleted_at IS NULL',
    { replacements: { testEmail }, type: QueryTypes.SELECT }
  );

  const user = users[0];
  console.log(`User ID: ${user.id}`);
  console.log(`Tenant ID: ${user.tenant_id}`);
  console.log(`User Status: ${user.status}`);
  console.log(`Must Change Password: ${user.must_change_password}`);
  console.log(`Database Password Hash: ${user.password_hash}`);

  const isMatchEmailed = await bcrypt.compare(emailedPassword, user.password_hash);
  console.log(`Bcrypt Compare (Emailed Password "${emailedPassword}"): ${isMatchEmailed ? '✅ MATCH' : '❌ MISMATCH'}`);
  if (!isMatchEmailed) {
    console.error('❌ CRITICAL: Password mismatch detected!');
    return;
  }

  // STEP 6: Audit Tenant, Store, and Roles
  console.log('\n[STEP 6] Auditing Multi-Tenant Entity Linking (Tenant, Store, Roles)...');
  const tenants = await seq.query('SELECT * FROM tenants WHERE id = :tId', {
    replacements: { tId: user.tenant_id },
    type: QueryTypes.SELECT,
  });
  console.log(`Tenant ID ${tenants[0].id} Name: "${tenants[0].name}" Status: ${tenants[0].status}`);

  const stores = await seq.query('SELECT * FROM stores WHERE tenant_id = :tId', {
    replacements: { tId: user.tenant_id },
    type: QueryTypes.SELECT,
  });
  console.log(`Store ID ${stores[0].id} Name: "${stores[0].name}" Status: ${stores[0].status}`);

  const roles = await seq.query(
    'SELECT ur.*, r.code as role_code, r.name as role_name FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = :uId',
    { replacements: { uId: user.id }, type: QueryTypes.SELECT }
  );
  console.log(`User Role Assigned: ${roles[0].role_name} (${roles[0].role_code})`);

  // STEP 7: Authenticate via HTTP Auth API with Emailed Password
  console.log(`\n[STEP 7] Authenticating via HTTP API with Emailed Credentials...`);
  const loginRes = await req.post('/api/v1/auth/login').send({
    email: testEmail,
    password: emailedPassword,
  });

  console.log(`HTTP Login Response Status: ${loginRes.status}`);
  if (loginRes.status === 200) {
    console.log(`🎉 HTTP API LOGIN SUCCESSFUL!`);
    console.log(`Access Token: ${loginRes.body.data?.accessToken ? 'RECEIVED' : 'NONE'}`);
    console.log(`Tenant Name: ${loginRes.body.data?.tenant?.name}`);
    console.log(`Tenant Slug: ${loginRes.body.data?.tenant?.slug}`);
  } else {
    console.error(`❌ HTTP API LOGIN FAILED:`, JSON.stringify(loginRes.body));
    return;
  }

  console.log('\n====================================================');
  console.log('✅ ALL FORENSIC CHECKS PASSED WITH 100% SUCCESS!');
  console.log('====================================================\n');
}

runLiveEmailAudit()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Audit failed:', err);
    process.exit(1);
  });
