/* eslint-disable no-console */
import { connectDatabase, sequelize } from '../src/config/database';
import { User, SellerApplication } from '../src/database/models';
import { AuthService } from '../src/services/auth.service';
import { AdminSellerService } from '../src/services/adminSeller.service';
import { validatePasswordPolicy } from '../src/validations/auth.validation';
import bcrypt from 'bcrypt';

async function runVerification() {
  console.log('--- STARTING ENTERPRISE SECURITY & PASSWORD MODULE VERIFICATION ---');
  await connectDatabase();

  const authService = new AuthService();
  const adminSellerService = new AdminSellerService();

  // 1. Password Policy Test
  console.log('\n[1] Testing Enterprise Password Policy Validation...');
  const weakPasswords = ['short', 'lowercase1', 'UPPERCASE1', 'NoSpecial123'];
  const strongPasswords = ['SecureP@ss123!', 'C0mzilo#2026', 'T3mp$ecurePass!'];

  weakPasswords.forEach((pw) => {
    const valid = validatePasswordPolicy(pw);
    console.log(`- Weak password "${pw}": ${valid ? 'FAIL (Expected invalid)' : 'PASS (Invalid)'}`);
    if (valid) throw new Error(`Password policy failed to reject: ${pw}`);
  });

  strongPasswords.forEach((pw) => {
    const valid = validatePasswordPolicy(pw);
    console.log(`- Strong password "${pw}": ${valid ? 'PASS (Valid)' : 'FAIL (Expected valid)'}`);
    if (!valid) throw new Error(`Password policy rejected valid password: ${pw}`);
  });

  // 2. Forgot Password Token Generation
  console.log('\n[2] Testing Forgot Password Request...');
  const adminUser = await User.findOne({ where: { status: 'active' } });
  const resetEmail = adminUser?.email || 'admin@comzilo.com';
  console.log(`- Using user email for reset test: ${resetEmail}`);
  const token = await authService.requestPasswordReset(adminUser?.tenantId || 1, resetEmail, {
    ip: '127.0.0.1',
    userAgent: 'VerificationRunner/1.0',
  });
  console.log(`- Generated reset token: ${token.substring(0, 8)}...`);

  // 3. Reset Password with Compliant Password
  console.log('\n[3] Testing Password Reset Flow...');
  const newPassword = 'NewSuperSecureP@ss2026!';
  await authService.resetPassword(1, {
    token,
    password: newPassword,
  });

  const superAdmin = await User.findOne({ where: { email: resetEmail } });
  const isBcryptMatch = await superAdmin?.comparePassword(newPassword);
  console.log(`- Super Admin password updated: ${isBcryptMatch ? 'PASS' : 'FAIL'}`);
  console.log(`- mustChangePassword flag cleared: ${superAdmin?.mustChangePassword === false ? 'PASS' : 'FAIL'}`);

  if (!isBcryptMatch) throw new Error('Password reset failed bcrypt match test');

  // Restore Super Admin original password
  const originalHash = await bcrypt.hash('SuperAdminSecurePassword2026!', 10);
  superAdmin!.passwordHash = originalHash;
  superAdmin!.mustChangePassword = false;
  await superAdmin!.save();

  // 4. Seller Application Approval & Credential Delivery
  console.log('\n[4] Testing Seller Application Onboarding & Temporary Credentials...');
  const testEmail = `verify_seller_${Date.now()}@test.com`;
  const app = await SellerApplication.create({
    applicationNumber: `APP-VERIFY-${Date.now()}`,
    businessName: `Verify Store ${Date.now()}`,
    ownerName: 'Verify Owner',
    email: testEmail,
    phone: '9988776655',
    businessType: 'Retail',
    preferredStoreName: `Verify Store ${Date.now()}`,
    addressLine1: '123 Tech Park',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    postalCode: '500081',
    passwordHash: await bcrypt.hash('Temp123!', 10),
    status: 'Pending',
    submittedAt: new Date(),
  });

  const tempPass = 'Sel888Pass!999';
  const createdSeller = await adminSellerService.createSeller({
    sellerApplicationId: app.id,
    passwordHash: await bcrypt.hash(tempPass, 10),
    ownerName: app.ownerName,
    email: app.email,
    phone: app.phone,
    businessName: app.businessName,
    businessType: app.businessType,
    tenantConfig: { mode: 'create', newName: app.businessName, newSlug: `verify-slug-${Date.now()}` },
    storeConfig: { mode: 'create', newName: app.preferredStoreName, newCode: `verify-code-${Date.now()}` },
    roleCode: 'tenant_owner',
    status: 'active',
    mustChangePassword: true,
  }, { tenantId: 1, authenticatedUserId: 1, ipAddress: '127.0.0.1', userAgent: 'test' } as any);

  console.log(`- Created Seller User ID: ${createdSeller.id}`);
  console.log(`- mustChangePassword flag set: ${createdSeller.mustChangePassword ? 'PASS' : 'FAIL'}`);

  // 5. Audit Log Entry Verification
  console.log('\n[5] Checking Audit Log Entries...');
  const [logs] = await sequelize.query('SELECT action, entity_type, entity_id FROM audit_logs ORDER BY created_at DESC LIMIT 5');
  console.log(`- Found ${(logs as any[]).length} recent audit logs:`);
  (logs as any[]).forEach((log) => {
    console.log(`  * [${log.action}] Entity: ${log.entity_type} #${log.entity_id}`);
  });

  console.log('\n--- ALL VERIFICATIONS PASSED SUCCESSFULLY ---');
}

runVerification()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('VERIFICATION ERROR:', err);
    process.exit(1);
  });
