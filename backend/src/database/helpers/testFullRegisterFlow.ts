import { connectDatabase } from '../../config/database';
import { app } from '../../app';
import supertest from 'supertest';

export const testFullFlow = async () => {
  await connectDatabase();
  const req = supertest(app);

  console.log('[1] Testing POST /api/v1/auth/register for hemanthgannamani@gmail.com...');
  const regRes = await req.post('/api/v1/auth/register').send({
    firstName: 'hemanth',
    lastName: 'gannamani',
    email: 'hemanthgannamani@gmail.com',
    password: 'Password123!',
  });

  console.log(`Register Status: ${regRes.status}`);
  console.log('Register Body:', JSON.stringify(regRes.body, null, 2));

  console.log('\n[2] Testing POST /api/v1/auth/login for hemanthgannamani@gmail.com...');
  const loginRes = await req.post('/api/v1/auth/login').send({
    email: 'hemanthgannamani@gmail.com',
    password: 'Password123!',
  });

  console.log(`Login Status: ${loginRes.status}`);
  console.log('Login Body:', JSON.stringify(loginRes.body, null, 2));
};

testFullFlow()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
