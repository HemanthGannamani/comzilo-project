/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from '../../app';
import supertest from 'supertest';
import { logger } from '../../shared/logging/logger';
import { connectDatabase } from '../../config/database';

async function runVerification() {
  await connectDatabase();
  logger.info('=== STARTING STORE PRODUCT MODULE QA VERIFICATION ===');

  // 1. Authenticate Seller User
  const loginRes = await supertest(app)
    .post('/api/v1/auth/login')
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      email: 'admin@comzilo.com',
      password: 'SuperAdminSecurePassword2026!',
    });

  const token = loginRes.body.data.accessToken;
  logger.info('Seller / Store Admin authenticated successfully.');

  // 2. GET /api/v1/store/products
  logger.info('--- 1. VERIFYING STORE PRODUCTS LIST API ---');
  const getRes = await supertest(app)
    .get('/api/v1/store/products')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getRes.status !== 200) {
    throw new Error(`Failed to fetch store products: ${JSON.stringify(getRes.body)}`);
  }
  logger.info('✅ Products list fetch verified.');

  // 3. CREATE Physical Product
  logger.info('--- 2. CREATING PHYSICAL PRODUCT ---');
  const createPhysical = await supertest(app)
    .post('/api/v1/store/products')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'Enterprise Physical T-Shirt',
      productTypeCode: 'physical',
      sku: `PHYS-${Date.now()}`,
      price: 29.99,
      shipping: { weight: 0.5, length: 10, width: 8, height: 2 },
      seo: { metaTitle: 'Physical T-Shirt', metaDescription: 'Quality cotton shirt' },
    });

  if (createPhysical.status !== 201) {
    throw new Error(`Failed to create physical product: ${JSON.stringify(createPhysical.body)}`);
  }
  const physicalId = createPhysical.body.data.id;
  logger.info(`✅ Physical product created ID ${physicalId}`);

  // 4. CREATE Variable Product with Option Sets & Variants (NO STOCK)
  logger.info('--- 3. CREATING VARIABLE PRODUCT ---');
  const createVariable = await supertest(app)
    .post('/api/v1/store/products')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'Configurable Denim Jacket',
      productTypeCode: 'variable',
      sku: `VAR-${Date.now()}`,
      price: 89.99,
      optionSets: [
        { name: 'Color', values: ['Blue', 'Black'] },
        { name: 'Size', values: ['M', 'L'] },
      ],
      variants: [
        { sku: `VAR-BLUE-M-${Date.now()}`, price: 89.99, weight: 1.2 },
        { sku: `VAR-BLACK-L-${Date.now()}`, price: 94.99, weight: 1.3 },
      ],
    });

  if (createVariable.status !== 201) {
    throw new Error(`Failed to create variable product: ${JSON.stringify(createVariable.body)}`);
  }
  logger.info(`✅ Variable product created ID ${createVariable.body.data.id}`);

  // 5. CREATE Virtual Product
  logger.info('--- 4. CREATING VIRTUAL PRODUCT ---');
  const createVirtual = await supertest(app)
    .post('/api/v1/store/products')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'Annual Software Membership License',
      productTypeCode: 'virtual',
      sku: `VIRT-${Date.now()}`,
      price: 199.0,
      virtual: {
        licenseKey: 'PRO-2026-KEY-8899',
        meetingLink: 'https://zoom.us/j/99887766',
        serviceDuration: 365,
      },
    });

  if (createVirtual.status !== 201) {
    throw new Error(`Failed to create virtual product: ${JSON.stringify(createVirtual.body)}`);
  }
  logger.info(`✅ Virtual product created ID ${createVirtual.body.data.id}`);

  // 6. CREATE Downloadable Product
  logger.info('--- 5. CREATING DOWNLOADABLE PRODUCT ---');
  const createDownloadable = await supertest(app)
    .post('/api/v1/store/products')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'SaaS Architecture E-Book PDF',
      productTypeCode: 'downloadable',
      sku: `DL-${Date.now()}`,
      price: 14.99,
      downloads: [
        {
          url: 'https://storage.comzilo.com/files/ebook-v1.pdf',
          filename: 'ebook-v1.pdf',
          version: '1.0.0',
          downloadLimit: 5,
        },
      ],
    });

  if (createDownloadable.status !== 201) {
    throw new Error(
      `Failed to create downloadable product: ${JSON.stringify(createDownloadable.body)}`
    );
  }
  logger.info(`✅ Downloadable product created ID ${createDownloadable.body.data.id}`);

  // 7. CREATE Print on Demand Product
  logger.info('--- 6. CREATING PRINT ON DEMAND PRODUCT ---');
  const createPod = await supertest(app)
    .post('/api/v1/store/products')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'Custom Printed Canvas Mug',
      productTypeCode: 'print_on_demand',
      sku: `POD-${Date.now()}`,
      price: 19.99,
      pod: {
        canvasSize: '1000x1000',
        printArea: 'Front Center',
        mockupPreviewUrl: 'https://storage.comzilo.com/pod/mug-mock.png',
      },
    });

  if (createPod.status !== 201) {
    throw new Error(`Failed to create POD product: ${JSON.stringify(createPod.body)}`);
  }
  logger.info(`✅ Print on Demand product created ID ${createPod.body.data.id}`);

  // 8. Bulk Action
  logger.info('--- 7. TESTING BULK ACTION ---');
  const bulkRes = await supertest(app)
    .post('/api/v1/store/products/bulk-action')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({ action: 'publish', ids: [physicalId] });

  if (bulkRes.status !== 200) {
    throw new Error(`Failed bulk action: ${JSON.stringify(bulkRes.body)}`);
  }
  logger.info('✅ Bulk publish action verified.');

  // 9. Soft Delete
  logger.info('--- 8. TESTING PRODUCT DELETE ---');
  const deleteRes = await supertest(app)
    .delete(`/api/v1/store/products/${physicalId}`)
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (deleteRes.status !== 200) {
    throw new Error(`Failed to delete product: ${JSON.stringify(deleteRes.body)}`);
  }
  logger.info('✅ Soft delete verified.');

  logger.info('🎉 STORE PRODUCT MODULE QA VERIFICATION PASSED');
  process.exit(0);
}

runVerification().catch((error) => {
  logger.error(`❌ Store Product QA verification failed: ${error.message}`);
  logger.error(error.stack);
  process.exit(1);
});
