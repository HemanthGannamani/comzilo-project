import { connectDatabase } from '../../config/database';
import { app } from '../../app';
import supertest from 'supertest';

export const testRegistration = async () => {
  await connectDatabase();
  const req = supertest(app);

  console.log('Testing customer registration API for hemanthgannamani@gmail.com...');

  const regRes = await req.post('/api/v1/auth/register').send({
    firstName: 'hemanth',
    lastName: 'gannamani',
    email: 'hemanthgannamani@gmail.com',
    password: 'password123',
  });

  console.log(`HTTP Status: ${regRes.status}`);
  console.log('Response Body:', JSON.stringify(regRes.body, null, 2));
};

testRegistration()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
