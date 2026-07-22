/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from '../../app';
import supertest from 'supertest';
import { logger } from '../../shared/logging/logger';
import { connectDatabase } from '../../config/database';

async function runVerification() {
  await connectDatabase();
  logger.info('=== STARTING STORE CMS MODULE QA VERIFICATION ===');

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

  // 2. CREATE & ACTIVATE Storefront Theme
  logger.info('--- 1. CREATING & ACTIVATING THEME ---');
  const createTheme = await supertest(app)
    .post('/api/v1/store/cms/themes')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'Apex Modern Theme',
      code: 'apex_modern',
      themeSettings: { primaryColor: '#6366f1', fontFamily: 'Inter' },
      customCss: '.hero-btn { border-radius: 8px; }',
    });

  if (createTheme.status !== 201) {
    throw new Error(`Failed to create theme: ${JSON.stringify(createTheme.body)}`);
  }
  const themeId = createTheme.body.data.id;
  logger.info(`✅ Theme created ID ${themeId}`);

  const actTheme = await supertest(app)
    .patch(`/api/v1/store/cms/themes/${themeId}/activate`)
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (actTheme.status !== 200 || !actTheme.body.data.isActive) {
    throw new Error(`Failed to activate theme: ${JSON.stringify(actTheme.body)}`);
  }
  logger.info('✅ Theme activated successfully.');

  // 3. CREATE PAGE, ADD DYNAMIC SECTION & PUBLISH
  logger.info('--- 2. CREATING CMS PAGE, SECTIONS & PUBLISHING ---');
  const createPage = await supertest(app)
    .post('/api/v1/store/cms/pages')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      title: 'Storefront Homepage',
      slug: 'home',
      template: 'homepage',
      isHomepage: true,
    });

  if (createPage.status !== 201) {
    throw new Error(`Failed to create page: ${JSON.stringify(createPage.body)}`);
  }
  const pageId = createPage.body.data.id;
  logger.info(`✅ CMS Page created ID ${pageId}`);

  const addSection = await supertest(app)
    .post('/api/v1/store/cms/pages/sections')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      pageId,
      sectionType: 'hero_banner',
      sortOrder: 1,
      settingsJson: { title: 'Welcome to Our Store', buttonText: 'Shop Now' },
    });

  if (addSection.status !== 201) {
    throw new Error(`Failed to add section: ${JSON.stringify(addSection.body)}`);
  }
  logger.info(`✅ Dynamic section added ID ${addSection.body.data.id}`);

  const pubPage = await supertest(app)
    .patch(`/api/v1/store/cms/pages/${pageId}/publish`)
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (pubPage.status !== 200 || pubPage.body.data.status !== 'published') {
    throw new Error(`Failed to publish page: ${JSON.stringify(pubPage.body)}`);
  }
  logger.info('✅ CMS Page published & version snapshot created.');

  // 4. CREATE NAVIGATION MENU & ITEMS
  logger.info('--- 3. CREATING NAVIGATION MENU ---');
  const createMenu = await supertest(app)
    .post('/api/v1/store/cms/navigation')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'Main Header Bar',
      location: 'header',
      isMegaMenu: true,
      items: [
        { title: 'Home', url: '/', type: 'custom', sortOrder: 1 },
        { title: 'Catalog', url: '/products', type: 'custom', sortOrder: 2 },
      ],
    });

  if (createMenu.status !== 201) {
    throw new Error(`Failed to create menu: ${JSON.stringify(createMenu.body)}`);
  }
  logger.info(`✅ Navigation Menu created ID ${createMenu.body.data.id}`);

  // 5. CREATE BLOG POST
  logger.info('--- 4. PUBLISHING BLOG POST ---');
  const createBlog = await supertest(app)
    .post('/api/v1/store/cms/blog')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      title: 'Top 10 E-commerce Trends for 2026',
      slug: 'top-10-ecommerce-trends-2026',
      content: '<p>Discover the future of online retail and modern web apps...</p>',
      status: 'published',
    });

  if (createBlog.status !== 201) {
    throw new Error(`Failed to create blog post: ${JSON.stringify(createBlog.body)}`);
  }
  logger.info(`✅ Blog Post published ID ${createBlog.body.data.id}`);

  // 6. UPLOAD / REGISTER MEDIA ASSET
  logger.info('--- 5. REGISTERING MEDIA ASSET ---');
  const createMedia = await supertest(app)
    .post('/api/v1/store/cms/media')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      filename: 'hero_summer_banner.png',
      fileUrl: 'https://cdn.comzilo.com/media/hero_summer_banner.png',
      mimeType: 'image/png',
      fileSize: 204800,
      altText: 'Summer Collection Promotional Banner',
    });

  if (createMedia.status !== 201) {
    throw new Error(`Failed to register media asset: ${JSON.stringify(createMedia.body)}`);
  }
  logger.info(`✅ Media Asset registered ID ${createMedia.body.data.id}`);

  // 7. CREATE FORM & SUBMIT DATA
  logger.info('--- 6. CREATING FORM & SUBMITTING ENTRY ---');
  const createForm = await supertest(app)
    .post('/api/v1/store/cms/forms')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'Contact Support Form',
      formFields: [
        { label: 'Name', type: 'text', required: true },
        { label: 'Email', type: 'email', required: true },
      ],
    });

  if (createForm.status !== 201) {
    throw new Error(`Failed to create form: ${JSON.stringify(createForm.body)}`);
  }
  const formId = createForm.body.data.id;
  logger.info(`✅ Form created ID ${formId}`);

  const subForm = await supertest(app)
    .post(`/api/v1/store/cms/forms/${formId}/submit`)
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      submissionData: { name: 'John Doe', email: 'johndoe@example.com', message: 'Hello!' },
    });

  if (subForm.status !== 201) {
    throw new Error(`Failed to submit form: ${JSON.stringify(subForm.body)}`);
  }
  logger.info(`✅ Form entry submitted ID ${subForm.body.data.id}`);

  logger.info('🎉 STORE CMS MODULE QA VERIFICATION PASSED');
  process.exit(0);
}

runVerification().catch((error) => {
  logger.error(`❌ Store CMS QA verification failed: ${error.message}`);
  logger.error(error.stack);
  process.exit(1);
});
