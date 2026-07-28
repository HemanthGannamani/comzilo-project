const { Customer } = require('./dist/database/models/customer.js');

async function listAllCustomers() {
  const customers = await Customer.findAll();
  console.log('Total customers in database:', customers.length);
  for (const c of customers) {
    console.log(`ID: ${c.id} | Email: ${c.email} | Name: ${c.firstName} ${c.lastName} | tenantId: ${c.tenantId} | storeId: ${c.storeId}`);
  }
}

listAllCustomers();
