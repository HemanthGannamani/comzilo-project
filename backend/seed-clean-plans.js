const { sequelize } = require('./dist/config/database.js');

async function seedCleanPlans() {
  console.log('Seeding clean enterprise subscription plans...');

  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
  await sequelize.query('TRUNCATE TABLE plans;');

  await sequelize.query(`
    INSERT INTO plans (id, code, name, description, price_monthly, price_yearly, currency, trial_days, store_limit, user_limit, warehouse_limit, features, sort_order, is_active, created_at, updated_at)
    VALUES 
    (1, 'starter', 'Starter Plan', 'Essential storefront capabilities for small growing businesses', 49.00, 490.00, 'USD', 14, 1, 5, 1, JSON_ARRAY('Basic Catalog', 'POS Terminal', 'Standard Email Support', 'Mobile Checkout'), 1, 1, NOW(), NOW()),
    (2, 'pro', 'Professional Plan', 'Advanced multi-warehouse suite for scaling multi-location merchants', 149.00, 1490.00, 'USD', 14, 5, 25, 5, JSON_ARRAY('Multi-Warehouse Inventory', 'POS Split Payments', 'CSV Reports & Export', 'Priority Support', 'Custom Domains'), 2, 1, NOW(), NOW()),
    (3, 'enterprise', 'Enterprise Monolith', 'Unlimited performance, custom integrations, and 24/7 dedicated SLA', 499.00, 4990.00, 'USD', 30, 999, 999, 999, JSON_ARRAY('Unlimited Warehouses', 'Webhooks & HMAC Security', 'Custom Integrations', '24/7 Dedicated SLA Support', 'White-Label Branding'), 3, 1, NOW(), NOW());
  `);

  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

  console.log('Clean enterprise plans seeded!');
  process.exit(0);
}

seedCleanPlans().catch(err => {
  console.error(err);
  process.exit(1);
});
