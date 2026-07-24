import { connectDatabase } from '../../config/database';
import { app } from '../../app';
import supertest from 'supertest';

export const debugGet = async () => {
  await connectDatabase();
  const req = supertest(app);

  const res = await req.get('/api/v1/products');
  console.log('Status:', res.status);
  console.log('Body:', JSON.stringify(res.body, null, 2));
};

debugGet()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
