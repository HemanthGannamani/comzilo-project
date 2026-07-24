import { connectDatabase, sequelize } from '../../config/database';
import { QueryTypes } from 'sequelize';

export const inspectSatish = async () => {
  await connectDatabase();

  console.log('====================================================');
  console.log('INSPECTING PRODUCTS CREATED BY SATISH IN SELLER PANEL');
  console.log('====================================================');

  const products: any[] = await sequelize.query(
    `SELECT id, tenant_id, store_id, name, product_type, status, visibility, created_at FROM products WHERE id IN (59, 58, 55, 53, 52, 44) ORDER BY id DESC`,
    { type: QueryTypes.SELECT }
  );

  console.table(products);

  console.log('\n[Check Seller User Satish Trade]');
  const sellers: any[] = await sequelize.query(
    `SELECT u.id, u.email, u.tenant_id, t.name as tenant_name FROM users u JOIN tenants t ON u.tenant_id = t.id WHERE u.email LIKE '%satish%' OR t.name LIKE '%satish%'`,
    { type: QueryTypes.SELECT }
  );
  console.table(sellers);
};

inspectSatish()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
