const { sequelize } = require('./dist/config/database.js');

async function migratePlanColumns() {
  console.log('Migrating plans table columns...');

  const queryInterface = sequelize.getQueryInterface();
  const tableDesc = await queryInterface.describeTable('plans');

  if (!tableDesc.store_limit) {
    await sequelize.query('ALTER TABLE plans ADD COLUMN store_limit INT DEFAULT 1');
    console.log('Added store_limit column');
  }
  if (!tableDesc.user_limit) {
    await sequelize.query('ALTER TABLE plans ADD COLUMN user_limit INT DEFAULT 5');
    console.log('Added user_limit column');
  }
  if (!tableDesc.warehouse_limit) {
    await sequelize.query('ALTER TABLE plans ADD COLUMN warehouse_limit INT DEFAULT 1');
    console.log('Added warehouse_limit column');
  }
  if (!tableDesc.features) {
    await sequelize.query('ALTER TABLE plans ADD COLUMN features JSON NULL');
    console.log('Added features column');
  }
  if (!tableDesc.sort_order) {
    await sequelize.query('ALTER TABLE plans ADD COLUMN sort_order INT DEFAULT 0');
    console.log('Added sort_order column');
  }

  // Update existing rows with initial values
  await sequelize.query(`
    UPDATE plans SET 
      store_limit = 1, user_limit = 5, warehouse_limit = 1, 
      features = JSON_ARRAY('Basic Catalog', 'POS Terminal', 'Standard Email Support')
    WHERE code = 'starter';
  `);

  await sequelize.query(`
    UPDATE plans SET 
      store_limit = 5, user_limit = 25, warehouse_limit = 5, 
      features = JSON_ARRAY('Multi-Warehouse Inventory', 'POS Split Payments', 'CSV Reports & Export', 'Priority Support')
    WHERE code = 'pro' OR code = 'professional';
  `);

  await sequelize.query(`
    UPDATE plans SET 
      store_limit = 999, user_limit = 999, warehouse_limit = 999, 
      features = JSON_ARRAY('Unlimited Warehouses', 'Webhooks & HMAC', 'Custom Integrations', '24/7 SLA Support')
    WHERE code = 'enterprise';
  `);

  console.log('Plans table migration completed successfully!');
  process.exit(0);
}

migratePlanColumns().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
