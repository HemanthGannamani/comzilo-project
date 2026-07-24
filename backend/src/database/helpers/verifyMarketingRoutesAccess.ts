import { connectDatabase } from '../../config/database';
import { app } from '../../app';
import supertest from 'supertest';

export const verifyRoutes = async () => {
  await connectDatabase();
  const req = supertest(app);

  console.log('====================================================');
  console.log('SELLER PANEL MARKETING SIDEBAR & ROUTE VERIFICATION');
  console.log('====================================================');

  const loginRes = await req.post('/api/v1/auth/login').send({
    email: 'admin@comzilo.com',
    password: 'SuperAdminSecurePassword2026!',
  });
  const token = loginRes.body.data.accessToken;

  const routesToTest = [
    '/api/v1/marketing/dashboard',
    '/api/v1/marketing/email-providers',
    '/api/v1/marketing/email-templates',
    '/api/v1/marketing/campaigns',
    '/api/v1/marketing/coupons',
    '/api/v1/marketing/abandoned-carts',
    '/api/v1/marketing/segments',
    '/api/v1/marketing/automation-rules',
  ];

  for (const route of routesToTest) {
    const res = await req.get(route).set('Authorization', `Bearer ${token}`);
    console.log(`Endpoint ${route} -> Status ${res.status}`);
    if (res.status !== 200) {
      throw new Error(`Failed to access endpoint ${route}`);
    }
  }

  console.log('====================================================');
  console.log('✅ ALL MARKETING SIDEBAR & API ROUTES VERIFIED 100%!');
  console.log('====================================================');
};

verifyRoutes()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
