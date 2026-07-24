import { connectDatabase } from '../../config/database';
import { app } from '../../app';
import supertest from 'supertest';

export const testFrontEndQuery = async () => {
  await connectDatabase();
  const req = supertest(app);

  console.log('Sending GET /api/v1/products?types=physical,variable...');
  const res = await req.get('/api/v1/products?types=physical,variable');

  console.log(`HTTP Status: ${res.status}`);
  console.log('Response Body:', JSON.stringify(res.body, null, 2));
};

testFrontEndQuery()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
