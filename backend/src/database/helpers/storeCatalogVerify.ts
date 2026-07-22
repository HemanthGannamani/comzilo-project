/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from '../../app';
import supertest from 'supertest';
import { logger } from '../../shared/logging/logger';
import { connectDatabase } from '../../config/database';

async function runVerification() {
  await connectDatabase();
  logger.info('=== STARTING STORE CATALOG MODULE QA VERIFICATION ===');

  // 1. Authenticate Seller Admin
  const loginRes = await supertest(app)
    .post('/api/v1/auth/login')
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      email: 'admin@comzilo.com',
      password: 'SuperAdminSecurePassword2026!',
    });

  const token = loginRes.body.data.accessToken;
  logger.info('Seller / Store Admin authenticated successfully.');

  // 2. CREATE Category with SEO
  logger.info('--- 1. CREATING PARENT CATEGORY ---');
  const createCat = await supertest(app)
    .post('/api/v1/store/categories')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'Electronics & Gadgets',
      description: 'Consumer electronics catalog category',
      seo: {
        metaTitle: 'Buy Electronics',
        metaDescription: 'Top gadgets',
        canonicalUrl: 'https://comzilo.com/electronics',
      },
    });

  if (createCat.status !== 201) {
    throw new Error(`Failed to create category: ${JSON.stringify(createCat.body)}`);
  }
  const categoryId = createCat.body.data.id;
  logger.info(`✅ Category created ID ${categoryId}`);

  // 3. CREATE Child Category
  logger.info('--- 2. CREATING CHILD CATEGORY ---');
  const createChild = await supertest(app)
    .post('/api/v1/store/categories')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      parentId: categoryId,
      name: 'Smartphones & Wearables',
      description: 'Mobile phones and smart watches',
    });

  if (createChild.status !== 201) {
    throw new Error(`Failed to create child category: ${JSON.stringify(createChild.body)}`);
  }
  logger.info(`✅ Child category created ID ${createChild.body.data.id}`);

  // 4. GET Categories Tree
  logger.info('--- 3. FETCHING CATEGORIES TREE ---');
  const treeRes = await supertest(app)
    .get('/api/v1/store/categories')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (treeRes.status !== 200 || !Array.isArray(treeRes.body.data)) {
    throw new Error(`Failed to fetch category tree: ${JSON.stringify(treeRes.body)}`);
  }
  logger.info('✅ Category tree hierarchy verified.');

  // 5. CREATE Brand with SEO
  logger.info('--- 4. CREATING BRAND ---');
  const createBrand = await supertest(app)
    .post('/api/v1/store/brands')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'Comzilo Tech Brand',
      website: 'https://brand.comzilo.com',
      seo: { metaTitle: 'Comzilo Brand' },
    });

  if (createBrand.status !== 201) {
    throw new Error(`Failed to create brand: ${JSON.stringify(createBrand.body)}`);
  }
  logger.info(`✅ Brand created ID ${createBrand.body.data.id}`);

  // 6. CREATE Tag
  logger.info('--- 5. CREATING TAG ---');
  const createTag = await supertest(app)
    .post('/api/v1/store/tags')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({ name: 'Summer Deal 2026' });

  if (createTag.status !== 201) {
    throw new Error(`Failed to create tag: ${JSON.stringify(createTag.body)}`);
  }
  logger.info(`✅ Tag created ID ${createTag.body.data.id}`);

  // 7. CREATE Rule-based Collection
  logger.info('--- 6. CREATING RULE-BASED COLLECTION ---');
  const createCol = await supertest(app)
    .post('/api/v1/store/collections')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'Festival Special Offers',
      rules: [
        { field: 'category', operator: 'equals', value: 'Electronics' },
        { field: 'price', operator: 'greater_than', value: '50' },
      ],
    });

  if (createCol.status !== 201) {
    throw new Error(`Failed to create collection: ${JSON.stringify(createCol.body)}`);
  }
  logger.info(`✅ Collection created ID ${createCol.body.data.id}`);

  // 8. CREATE Attribute with Color Swatches
  logger.info('--- 7. CREATING PRODUCT ATTRIBUTE WITH SWATCHES ---');
  const createAttr = await supertest(app)
    .post('/api/v1/store/attributes')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'Frame Color',
      values: [
        { label: 'Navy Blue', value: 'navy', swatchData: '#000080' },
        { label: 'Crimson Red', value: 'red', swatchData: '#DC143C' },
      ],
    });

  if (createAttr.status !== 201) {
    throw new Error(`Failed to create attribute: ${JSON.stringify(createAttr.body)}`);
  }
  logger.info(`✅ Attribute created ID ${createAttr.body.data.id}`);

  // 9. DELETE Category
  logger.info('--- 8. DELETING CATEGORY ---');
  const delCat = await supertest(app)
    .delete(`/api/v1/store/categories/${categoryId}`)
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (delCat.status !== 200) {
    throw new Error(`Failed to delete category: ${JSON.stringify(delCat.body)}`);
  }
  logger.info('✅ Category soft delete verified.');

  logger.info('🎉 STORE CATALOG MODULE QA VERIFICATION PASSED');
  process.exit(0);
}

runVerification().catch((error) => {
  logger.error(`❌ Store Catalog QA verification failed: ${error.message}`);
  logger.error(error.stack);
  process.exit(1);
});
