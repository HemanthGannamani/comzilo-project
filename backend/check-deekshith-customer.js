const { User } = require('./dist/database/models/user.js');
const { Customer } = require('./dist/database/models/customer.js');
const { Store } = require('./dist/database/models/store.js');

async function checkDeekshithCustomer() {
  console.log('--- Stores in DB ---');
  const stores = await Store.findAll();
  for (const s of stores) {
    console.log(`Store ID: ${s.id} | Name: "${s.name}" | Slug: "${s.slug}" | tenantId: ${s.tenantId}`);
  }

  console.log('\n--- Seller Account (satishveeravalli2004@gmail.com) ---');
  const seller = await User.findOne({ where: { email: 'satishveeravalli2004@gmail.com' } });
  if (seller) {
    console.log(`Seller ID: ${seller.id} | tenantId: ${seller.tenantId} | storeId: ${seller.storeId}`);
  }

  console.log('\n--- Registered Customer (gannamani@gmail.com) ---');
  const custUser = await User.findOne({ where: { email: 'gannamani@gmail.com' } });
  const custRecord = await Customer.findOne({ where: { email: 'gannamani@gmail.com' } });

  if (custUser) {
    console.log(`Customer User ID: ${custUser.id} | tenantId: ${custUser.tenantId} | storeId: ${custUser.storeId}`);
  } else {
    console.log('User gannamani@gmail.com NOT FOUND');
  }

  if (custRecord) {
    console.log(`Customer Record ID: ${custRecord.id} | tenantId: ${custRecord.tenantId} | storeId: ${custRecord.storeId}`);
  } else {
    console.log('Customer Record gannamani@gmail.com NOT FOUND in customers table');
  }
}

checkDeekshithCustomer();
