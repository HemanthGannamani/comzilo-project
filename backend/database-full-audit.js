const { sequelize } = require('./dist/config/database.js');
const { QueryTypes } = require('sequelize');

async function fullAudit() {
  console.log('================ STEP 1: DATABASE AUDIT ================');

  // 1. Sellers / Applications
  const appsCount = await sequelize.query('SELECT COUNT(*) as c FROM seller_applications', { type: QueryTypes.SELECT });
  const approvedAppsCount = await sequelize.query('SELECT COUNT(*) as c FROM seller_applications WHERE status = "approved"', { type: QueryTypes.SELECT });

  // 2. Stores
  const storesCount = await sequelize.query('SELECT COUNT(*) as c FROM stores', { type: QueryTypes.SELECT });

  // 3. Tenants
  const tenantsCount = await sequelize.query('SELECT COUNT(*) as c FROM tenants', { type: QueryTypes.SELECT });

  // 4. Users (Sellers) via user_roles or role_id
  const sellerUsersCount = await sequelize.query(
    'SELECT COUNT(DISTINCT user_id) as c FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE r.name IN ("SELLER", "SELLER_ADMIN", "STORE_MANAGER")',
    { type: QueryTypes.SELECT }
  );

  console.log(`• Total Seller Applications: ${appsCount[0].c} (Approved: ${approvedAppsCount[0].c})`);
  console.log(`• Total Stores in DB: ${storesCount[0].c}`);
  console.log(`• Total Tenants in DB: ${tenantsCount[0].c}`);
  console.log(`• Total Seller Users in DB: ${sellerUsersCount[0].c}`);

  // Check Orphan Stores (stores with tenant_id not matching any tenant)
  const orphanStores = await sequelize.query(
    'SELECT s.id, s.name, s.tenant_id FROM stores s LEFT JOIN tenants t ON s.tenant_id = t.id WHERE t.id IS NULL',
    { type: QueryTypes.SELECT }
  );
  console.log(`• Orphan Stores (no matching tenant): ${orphanStores.length}`);

  // Check Duplicate Store Slugs
  const duplicateSlugs = await sequelize.query(
    'SELECT slug, COUNT(*) as count FROM stores GROUP BY slug HAVING count > 1',
    { type: QueryTypes.SELECT }
  );
  console.log(`• Duplicate Store Slugs: ${duplicateSlugs.length}`);

  // Check linking of stores to seller applications / users
  const storesWithoutUsers = await sequelize.query(
    'SELECT s.id, s.name, s.tenant_id FROM stores s LEFT JOIN user_roles ur ON s.tenant_id = ur.tenant_id WHERE ur.id IS NULL AND s.id != 1',
    { type: QueryTypes.SELECT }
  );
  console.log(`• Stores without matching UserRole: ${storesWithoutUsers.length}`);

  process.exit(0);
}

fullAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
