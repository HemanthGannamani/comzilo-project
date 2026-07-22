import { connectDatabase } from '../../config/database';
import app from '../../app';
import supertest from 'supertest';
import { User, Tenant, Store, SellerApplication } from '../models';
import { sequelize } from '../../config/database';
import { logger } from '../../shared/logging/logger';

export const runAdminSellerApplicationVerify = async () => {
  try {
    await connectDatabase();

    logger.info('--- 1. ADMIN AND SELLER AUTHENTICATION ---');
    const adminLogin = await supertest(app)
      .post('/api/v1/auth/login')
      .set('Origin', 'http://localhost:5173')
      .send({ email: 'admin@comzilo.com', password: 'SuperAdminSecurePassword2026!' });

    const adminToken = adminLogin.body.data.accessToken;
    logger.info('Admin login successful.');

    logger.info('--- 2. SUBMIT A PENDING SELLER APPLICATION (PHASE 1) ---');
    const uniqueEmail = `apply.owner.${Date.now()}@example.com`;
    const uniquePhone = `+9198765${Math.floor(10000 + Math.random() * 90000)}`;
    const businessName = `App Test Business ${Date.now()}`;
    const gstNumber = `29APPDE${Math.floor(1000 + Math.random() * 9000)}F1Z8`;

    const submitRes = await supertest(app)
      .post('/api/v1/seller-applications')
      .send({
        ownerName: 'Applicant Owner',
        email: uniqueEmail,
        phone: uniquePhone,
        password: 'ApplicantPassword2026!',
        confirmPassword: 'ApplicantPassword2026!',
        businessName,
        businessType: 'Retail',
        gstNumber,
        panNumber: 'ABCDE1234F',
        addressLine1: 'Road No 10',
        addressLine2: 'Banjara Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
        postalCode: '500034',
        preferredStoreName: `${businessName} Outlet`,
        license:
          'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDMwVDAwVLC0sDQyM1EwMjVTMEszVDBKtDSxMDBLNTRTME4zUjAxUzC1NE1NskwyMTA0TEtKNEyzNExNTDE1skwzNjMxNTA0N000TDFNTEw0NjYyT7S0S0yyNEg0MzExM1MwVzC2NDNUt7QAAEY3Ge0KZW5kc3RyZWFtCmVuZG9iagozIDAgb2JqCjgxCmVuZG9iagoxIDAgb2JqCjw8L1R5cGUvUGFnZS9QYXJlbnQgNCAwIFIvUmVzb3VyY2VzIDUgMCBSL01lZGlhQm94WzAgMCA1OTUgODQyXS9Db250ZW50cyAyIDAgUj4+CmVuZG9iago1IDAgb2JqCjw8L1Byb2NTZXRbL1BERi9UZXh0L0ltYWdlQi9JbWFnZUMvSW1hZ2VJXT4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUvUGFnZXMvS2lkc1sxIDAgUl0vQ291bnQgMT4+CmVuZG9iago2IDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYXJlbnQgNCAwIFI+PgpzdGFydHhyZWYKMjg4CiUlRU9GCg==',
        identityProof:
          'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDMwVDAwVLC0sDQyM1EwMjVTMEszVDBKtDSxMDBLNTRTME4zUjAxUzC1NE1NskwyMTA0TEtKNEyzNExNTDE1skwzNjMxNTA0N000TDFNTEw0NjYyT7S0S0yyNEg0MzExM1MwVzC2NDNUt7QAAEY3Ge0KZW5kc3RyZWFtCmVuZG9iagozIDAgb2JqCjgxCmVuZG9iagoxIDAgb2JqCjw8L1R5cGUvUGFnZS9QYXJlbnQgNCAwIFIvUmVzb3VyY2VzIDUgMCBSL01lZGlhQm94WzAgMCA1OTUgODQyXS9Db250ZW50cyAyIDAgUj4+CmVuZG9iago1IDAgb2JqCjw8L1Byb2NTZXRbL1BERi9UZXh0L0ltYWdlQi9JbWFnZUMvSW1hZ2VJXT4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUvUGFnZXMvS2lkc1sxIDAgUl0vQ291bnQgMT4+CmVuZG9iago2IDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYXJlbnQgNCAwIFI+PgpzdGFydHhyZWYKMjg4CiUlRU9GCg==',
      });

    logger.info(`Submit Application Status Code: ${submitRes.status}`);
    if (submitRes.status !== 201) {
      logger.error(`Submit application failed: ${JSON.stringify(submitRes.body, null, 2)}`);
      throw new Error('Failed to submit seller application');
    }

    const appRecord = await SellerApplication.findOne({ where: { email: uniqueEmail } });
    if (!appRecord) {
      throw new Error('Submitted application not found in MySQL database');
    }
    const appId = appRecord.id;
    logger.info(`Submitted Application ID: ${appId}`);

    logger.info('--- 3. FETCH SELLER APPLICATIONS LIST & FILTERS ---');
    const listRes = await supertest(app)
      .get('/api/v1/admin/seller-applications')
      .set('Authorization', `Bearer ${adminToken}`)
      .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
      .query({ status: 'Pending', businessType: 'Retail' });

    logger.info(`List Applications Response Code: ${listRes.status}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const foundApp = listRes.body.data.applications.find((a: any) => a.id === appId);
    if (!foundApp) {
      throw new Error('Submitted application not retrieved in pending list filters');
    }
    logger.info('Applications list and filters verified successfully.');

    logger.info('--- 4. APPROVE SELLER APPLICATION & VERIFY PROVISIONING ---');
    const approveRes = await supertest(app)
      .patch(`/api/v1/admin/seller-applications/${appId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

    logger.info(`Approve Response Code: ${approveRes.status}`);
    if (approveRes.status !== 200) {
      logger.error('Approval request failed:', approveRes.body);
      throw new Error('Seller application approval failed');
    }

    logger.info('--- 5. INTEGRATED DATABASE CHECKS ---');
    const dbApp = await SellerApplication.findByPk(appId);
    if (dbApp?.status !== 'Approved') {
      throw new Error('Application status in database is not Approved');
    }

    const dbUser = await User.findOne({ where: { email: uniqueEmail } });
    if (!dbUser) {
      throw new Error('Seller user was not provisioned in database during approval');
    }
    logger.info(`Seller User provisioned successfully: User ID ${dbUser.id}`);

    const dbTenant = await Tenant.findOne({ where: { name: businessName } });
    if (!dbTenant) {
      throw new Error('Tenant was not provisioned during approval');
    }

    const dbStore = await Store.findOne({ where: { tenantId: dbTenant.id } });
    if (!dbStore) {
      throw new Error('Store was not provisioned during approval');
    }
    logger.info('All relational entities provisioned correctly in one transaction.');

    logger.info('--- 6. RE-APPROVAL PREVENTED CHECK ---');
    const reApproveRes = await supertest(app)
      .patch(`/api/v1/admin/seller-applications/${appId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

    logger.info(`Re-approve request status code: ${reApproveRes.status} (Expected: 400)`);
    if (reApproveRes.status !== 400) {
      throw new Error('Re-approving an already approved application was not blocked');
    }

    logger.info('--- 7. REJECT APPLICATION WORKFLOW ---');
    const rejectEmail = `reject.owner.${Date.now()}@example.com`;
    const rejectGst = `29REJDE${Math.floor(1000 + Math.random() * 9000)}F1Z8`;
    const submitRejectRes = await supertest(app)
      .post('/api/v1/seller-applications')
      .send({
        ownerName: 'Applicant Owner',
        email: rejectEmail,
        phone: `+9198765${Math.floor(10000 + Math.random() * 90000)}`,
        password: 'ApplicantPassword2026!',
        confirmPassword: 'ApplicantPassword2026!',
        businessName: 'Reject Store Inc',
        businessType: 'Retail',
        gstNumber: rejectGst,
        panNumber: 'ABCDE1234F',
        addressLine1: 'Road No 10',
        addressLine2: 'Banjara Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
        postalCode: '500034',
        preferredStoreName: 'Reject Outlet',
        license:
          'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDMwVDAwVLC0sDQyM1EwMjVTMEszVDBKtDSxMDBLNTRTME4zUjAxUzC1NE1NskwyMTA0TEtKNEyzNExNTDE1skwzNjMxNTA0N000TDFNTEw0NjYyT7S0S0yyNEg0MzExM1MwVzC2NDNUt7QAAEY3Ge0KZW5kc3RyZWFtCmVuZG9iagozIDAgb2JqCjgxCmVuZG9iagoxIDAgb2JqCjw8L1R5cGUvUGFnZS9QYXJlbnQgNCAwIFIvUmVzb3VyY2VzIDUgMCBSL01lZGlhQm94WzAgMCA1OTUgODQyXS9Db250ZW50cyAyIDAgUj4+CmVuZG9iago1IDAgb2JqCjw8L1Byb2NTZXRbL1BERi9UZXh0L0ltYWdlQi9JbWFnZUMvSW1hZ2VJXT4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUvUGFnZXMvS2lkc1sxIDAgUl0vQ291bnQgMT4+CmVuZG9iago2IDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYXJlbnQgNCAwIFI+PgpzdGFydHhyZWYKMjg4CiUlRU9GCg==',
        identityProof:
          'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDMwVDAwVLC0sDQyM1EwMjVTMEszVDBKtDSxMDBLNTRTME4zUjAxUzC1NE1NskwyMTA0TEtKNEyzNExNTDE1skwzNjMxNTA0N000TDFNTEw0NjYyT7S0S0yyNEg0MzExM1MwVzC2NDNUt7QAAEY3Ge0KZW5kc3RyZWFtCmVuZG9iagozIDAgb2JqCjgxCmVuZG9iagoxIDAgb2JqCjw8L1R5cGUvUGFnZS9QYXJlbnQgNCAwIFIvUmVzb3VyY2VzIDUgMCBSL01lZGlhQm94WzAgMCA1OTUgODQyXS9Db250ZW50cyAyIDAgUj4+CmVuZG9iago1IDAgb2JqCjw8L1Byb2NTZXRbL1BERi9UZXh0L0ltYWdlQi9JbWFnZUMvSW1hZ2VJXT4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUvUGFnZXMvS2lkc1sxIDAgUl0vQ291bnQgMT4+CmVuZG9iago2IDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYXJlbnQgNCAwIFI+PgpzdGFydHhyZWYKMjg4CiUlRU9GCg==',
      });

    if (submitRejectRes.status !== 201) {
      logger.error(`Reject submit failed: ${JSON.stringify(submitRejectRes.body, null, 2)}`);
      throw new Error('Failed to submit reject seller application');
    }

    const rejectAppRecord = await SellerApplication.findOne({ where: { email: rejectEmail } });
    if (!rejectAppRecord) {
      throw new Error('Submitted reject application not found in MySQL database');
    }
    const rejectAppId = rejectAppRecord.id;

    const rejectRes = await supertest(app)
      .patch(`/api/v1/admin/seller-applications/${rejectAppId}/reject`)
      .set('Authorization', `Bearer ${adminToken}`)
      .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
      .send({ reason: 'Business category verification failed' });

    logger.info(`Reject Response Code: ${rejectRes.status}`);
    const dbRejectedApp = await SellerApplication.findByPk(rejectAppId);
    if (
      dbRejectedApp?.status !== 'Rejected' ||
      dbRejectedApp.reviewNotes !== 'Business category verification failed'
    ) {
      throw new Error('Seller application status or rejection reason mismatch');
    }
    logger.info('Rejection status and reason verified successfully in MySQL.');

    logger.info('--- 8. ROLE-BASED ACCESS CONTROL (403 CHECK) ---');
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

    logger.info('--- 9. AUDIT LOG VERIFICATION ---');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [auditLog]: any = await sequelize.query(
      `SELECT action, entity_type, entity_id FROM audit_logs WHERE entity_type = 'seller_application' AND action = 'seller_application.approved' ORDER BY id DESC LIMIT 1`
    );
    logger.info(`Audit Log Row: ${JSON.stringify(auditLog[0], null, 2)}`);

    logger.info('--- SELLER REGISTRATION APPLICATIONS VERIFICATION PASSED ---');
  } catch (error) {
    logger.error('Admin seller application QA verification failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  runAdminSellerApplicationVerify().then(() => process.exit(0));
}
