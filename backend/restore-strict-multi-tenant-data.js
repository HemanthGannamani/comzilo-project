const { Customer } = require('./dist/database/models/customer.js');

async function restoreStrictMultiTenantData() {
  console.log('Restoring strict multi-tenant customer isolation data...');

  // Deekshith Trade Customers (tenantId: 41, storeId: 39)
  await Customer.update(
    { tenantId: 41, storeId: 39 },
    { where: { email: ['gannamani@gmail.com', 'veeravallisatish333@gmail.com'] } }
  );

  // Tenant 20 / Store 18 Customers
  await Customer.update(
    { tenantId: 20, storeId: 18 },
    { where: { email: ['hemanthgannamani@gmail.com', 'pedapolukarthikroy7@gmail.com', 'gannamanihemanthchowdary.23s@gmail.com'] } }
  );

  // Default Store 1 Customers
  await Customer.update(
    { tenantId: 1, storeId: 1 },
    { where: { email: ['john.doe@example.com', 'hemanth@gmail.com'] } }
  );

  console.log('Strict multi-tenant customer isolation restored!');
  process.exit(0);
}

restoreStrictMultiTenantData();
