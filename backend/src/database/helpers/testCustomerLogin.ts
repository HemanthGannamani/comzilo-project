import { connectDatabase } from '../../config/database';
import { app } from '../../app';
import supertest from 'supertest';

export const testLogin = async () => {
  await connectDatabase();
  const req = supertest(app);

  console.log('Testing customer authentication for pedapolukarthikroy7@gmail.com...');

  const loginRes = await req.post('/api/v1/auth/login').send({
    email: 'pedapolukarthikroy7@gmail.com',
    password: 'Password123!',
  });

  console.log(`HTTP Status: ${loginRes.status}`);
  if (loginRes.status === 200) {
    console.log('✅ LOGIN SUCCESSFUL!');
    console.log('Access Token:', loginRes.body?.data?.accessToken ? '[TOKEN GENERATED]' : '[NONE]');
    console.log('User Details:', {
      id: loginRes.body?.data?.user?.id,
      email: loginRes.body?.data?.user?.email,
      role: loginRes.body?.data?.user?.role,
    });
  } else {
    console.error('❌ LOGIN FAILED:', JSON.stringify(loginRes.body));
  }
};

testLogin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
