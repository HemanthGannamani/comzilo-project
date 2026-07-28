const { Customer } = require('./dist/database/models/customer.js');
const { Store } = require('./dist/database/models/store.js');

async function testRegistrationStoreResolution() {
  const timestamp = Date.now();
  const testEmail = `deekshith_cust_${timestamp}@example.com`;

  console.log(`Registering new customer account with storeSlug="deekshith trade"...`);

  const regRes = await fetch('http://localhost:5000/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'Deekshith',
      lastName: 'Customer',
      email: testEmail,
      password: 'TestPassword123!',
      storeSlug: 'deekshith trade',
    }),
  });

  const regData = await regRes.json();
  console.log('Registration Response Status:', regRes.status);
  console.log('Registration Response:', JSON.stringify(regData, null, 2));

  // Inspect the customer record created in DB
  const createdCust = await Customer.findOne({ where: { email: testEmail } });
  console.log('\n--- Customer Record Created in DB ---');
  if (createdCust) {
    console.log(`ID: ${createdCust.id} | Email: ${createdCust.email} | tenantId: ${createdCust.tenantId} | storeId: ${createdCust.storeId}`);
  } else {
    console.log('Customer record NOT found in DB');
  }

  // Now query customers for seller satishveeravalli2004@gmail.com (tenantId: 41, storeId: 39)
  console.log('\n--- Querying Customers for Deekshith Trade Seller ---');
  const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'satishveeravalli2004@gmail.com',
      password: 'Satish@123',
    }),
  });

  const loginData = await loginRes.json();
  const token = loginData?.data?.accessToken;

  const sellerCustRes = await fetch('http://localhost:5000/api/v1/customers', {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-tenant-id': '41',
      'x-store-id': '39',
    },
  });

  const sellerCustData = await sellerCustRes.json();
  console.log('Seller CRM Customers Count:', sellerCustData?.data?.count);
  console.log('Seller CRM Customers List:');
  for (const c of (sellerCustData?.data?.rows || [])) {
    console.log(`- ID: ${c.id} | Name: ${c.firstName} ${c.lastName} | Email: ${c.email} | tenantId: ${c.tenantId} | storeId: ${c.storeId}`);
  }
}

testRegistrationStoreResolution();
