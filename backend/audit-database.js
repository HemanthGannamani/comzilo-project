const { sequelize } = require('./dist/config/database.js');
const { QueryTypes } = require('sequelize');

async function auditDatabase() {
  const tablesRes = await sequelize.query('SHOW TABLES', { type: QueryTypes.SELECT });
  const tableNames = tablesRes.map(t => Object.values(t)[0]);
  
  const sellerTables = tableNames.filter(t => t.includes('seller') || t.includes('store') || t.includes('tenant') || t.includes('user') || t.includes('vendor') || t.includes('merchant'));
  console.log('Seller/Store/Tenant/User related tables:', sellerTables);

  for (const tableName of sellerTables) {
    const countRes = await sequelize.query(`SELECT COUNT(*) as count FROM \`${tableName}\``, { type: QueryTypes.SELECT });
    console.log(`Table '${tableName}': ${countRes[0].count} rows`);
  }

  process.exit(0);
}

auditDatabase().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
