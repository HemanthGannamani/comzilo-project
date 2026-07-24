import { connectDatabase } from '../../config/database';
import { app } from '../../app';
import supertest from 'supertest';

export const testLoginDebug = async () => {
  await connectDatabase();
  const req = supertest(app);

  console.log('Sending POST /api/v1/auth/login with hemanthgannamani@gmail.com...');

  const loginRes = await req.post('/api/v1/auth/login').send({
    email: 'hemanthgannamani@gmail.com',
    password: 'password123',
  });

  console.log(`HTTP Status: ${loginRes.status}`);
  console.log('Response Body:', JSON.stringify(loginRes.body, null, 2));
};

testLoginDebug()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
