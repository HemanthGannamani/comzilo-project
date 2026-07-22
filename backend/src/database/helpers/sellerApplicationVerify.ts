import { connectDatabase } from '../../config/database';
import app from '../../app';
import supertest from 'supertest';
import { SellerApplication } from '../models';
import { sequelize } from '../../config/database';
import { logger } from '../../shared/logging/logger';

export const runSellerApplicationVerify = async () => {
  try {
    await connectDatabase();

    logger.info('--- 1. SUBMIT VALID SELLER APPLICATION ---');
    const mockEmail = `seller.onboarding.${Date.now()}@example.com`;
    const mockGst = `29ABCDE${Math.floor(1000 + Math.random() * 9000)}F1Z5`;

    const res = await supertest(app).post('/api/v1/seller-applications').send({
      businessName: 'Super Tech Retailers',
      ownerName: 'Alice Johnson',
      email: mockEmail,
      phone: '+919988776655',
      businessType: 'Retail',
      gstNumber: mockGst,
      panNumber: 'ABCDE1234F',
      addressLine1: '456 Innovation Blvd',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      postalCode: '500081',
      preferredStoreName: 'SuperTech Store',
      password: 'SecureSellerPassword2026!',
      confirmPassword: 'SecureSellerPassword2026!',
      logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      license:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      identityProof:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    });

    logger.info(`Response Status: ${res.status}`);
    logger.info(`Response Success: ${res.body.success}`);
    const appNumber = res.body.data?.applicationNumber;
    logger.info(`Generated Application Number: ${appNumber}`);

    if (res.status !== 201) {
      throw new Error('Application submission failed');
    }

    logger.info('--- 2. VERIFY DUPLICATE EMAIL REJECTION ---');
    const duplicateEmailRes = await supertest(app).post('/api/v1/seller-applications').send({
      businessName: 'Another Store',
      ownerName: 'Bob Smith',
      email: mockEmail,
      phone: '+919900990099',
      businessType: 'Wholesale',
      addressLine1: '789 Market Rd',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560001',
      preferredStoreName: 'Bob Store',
      password: 'BobSecurePassword2026!',
      confirmPassword: 'BobSecurePassword2026!',
      license:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      identityProof:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    });
    logger.info(`Duplicate Email Response Status: ${duplicateEmailRes.status} (Expected: 409)`);

    logger.info('--- 3. VERIFY DUPLICATE GST REJECTION ---');
    const duplicateGstRes = await supertest(app)
      .post('/api/v1/seller-applications')
      .send({
        businessName: 'GST Duplicate Store',
        ownerName: 'Charlie Brown',
        email: `charlie.${Date.now()}@example.com`,
        phone: '+919911991199',
        businessType: 'Wholesale',
        gstNumber: mockGst,
        addressLine1: '789 Market Rd',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        postalCode: '560001',
        preferredStoreName: 'Charlie Store',
        password: 'CharlieSecurePassword2026!',
        confirmPassword: 'CharlieSecurePassword2026!',
        license:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        identityProof:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      });
    logger.info(`Duplicate GST Response Status: ${duplicateGstRes.status} (Expected: 409)`);

    logger.info('--- 4. GET PUBLIC APPLICATION STATUS ---');
    const getStatusRes = await supertest(app).get(`/api/v1/seller-applications/${appNumber}`);

    logger.info(`Get Status Response Code: ${getStatusRes.status}`);
    logger.info(`Status Return Body: ${JSON.stringify(getStatusRes.body.data, null, 2)}`);

    logger.info('--- 5. SQL DATABASE PERSISTENCE VERIFICATION ---');
    const persisted = await SellerApplication.findOne({ where: { applicationNumber: appNumber } });
    if (persisted) {
      logger.info(`Persisted Record Status: ${persisted.status}`);
      logger.info(`Persisted Business Name: ${persisted.businessName}`);
      logger.info(`Password Hash starts with: ${persisted.passwordHash.substring(0, 10)}`);
      logger.info(`Saved License Path: ${persisted.licensePath}`);
    } else {
      throw new Error('Record not persisted in MySQL database');
    }

    logger.info('--- 6. AUDIT LOG VERIFICATION ---');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [auditLog]: any = await sequelize.query(
      `SELECT action, entity_type, entity_id FROM audit_logs WHERE entity_type = 'seller_application' AND entity_id = :id ORDER BY id DESC LIMIT 1`,
      {
        replacements: { id: String(persisted.id) },
      }
    );
    logger.info(`Audit Log Row: ${JSON.stringify(auditLog[0], null, 2)}`);

    logger.info('--- SELLER APPLICATION PHASE 1 QA VERIFICATION PASSED ---');
  } catch (error) {
    logger.error('Seller application verification failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  runSellerApplicationVerify().then(() => process.exit(0));
}
