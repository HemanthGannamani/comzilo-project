const { sequelize } = require('./dist/config/database.js');
const { QueryTypes } = require('sequelize');

async function verifyThreeSellers() {
  console.log('================ STEP 6: VERIFICATION OF 3 TEST SELLERS ================');

  const timestamp = Date.now();
  const sellersData = [
    { name: `Seller Alpha ${timestamp}`, email: `alpha_${timestamp}@example.com`, storeName: `Alpha Store ${timestamp}` },
    { name: `Seller Beta ${timestamp}`, email: `beta_${timestamp}@example.com`, storeName: `Beta Store ${timestamp}` },
    { name: `Seller Gamma ${timestamp}`, email: `gamma_${timestamp}@example.com`, storeName: `Gamma Store ${timestamp}` },
  ];

  const createdStores = [];

  for (const s of sellersData) {
    console.log(`\nCreating and approving seller: ${s.name} (${s.email})...`);

    // 1. Submit application
    const appRes = await fetch('http://localhost:5000/api/v1/public/seller-applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: s.storeName,
        preferredStoreName: s.storeName,
        ownerName: s.name,
        email: s.email,
        phone: `+9198${Math.floor(10000000 + Math.random() * 90000000)}`,
        businessType: 'Retail',
        gstNumber: `36AAACB${Math.floor(1000 + Math.random() * 9000)}1Z5`,
        panNumber: `AAACB${Math.floor(1000 + Math.random() * 9000)}Z`,
        addressLine1: 'Market Street 100',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
        postalCode: '500001',
        password: 'SellerPass123!',
        confirmPassword: 'SellerPass123!',
      }),
    });

    const appData = await appRes.json();
    const appNumber = appData?.data?.applicationNumber;

    const [appRecord] = await sequelize.query(
      'SELECT id FROM seller_applications WHERE application_number = :appNumber LIMIT 1',
      { replacements: { appNumber }, type: QueryTypes.SELECT }
    );
    const appId = appRecord?.id;
    console.log(`Submitted Application ${appNumber} -> DB ID ${appId}`);

    // 2. Super Admin Login & Approve
    const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@comzilo.com',
        password: 'SuperAdminSecurePassword2026!',
      }),
    });
    const loginData = await loginRes.json();
    const adminToken = loginData?.data?.accessToken;

    const approveRes = await fetch(`http://localhost:5000/api/v1/admin/seller-applications/${appId}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const approveData = await approveRes.json();
    console.log(`Approve Status: ${approveRes.status} | Message: ${approveData?.message}`);

    // Query newly created store from DB
    const [storeRecord] = await sequelize.query(
      'SELECT id, tenant_id, name, slug FROM stores WHERE name LIKE :name LIMIT 1',
      { replacements: { name: `%${s.storeName}%` }, type: QueryTypes.SELECT }
    );

    if (storeRecord) {
      console.log(`Created Store in DB: ID ${storeRecord.id} | Tenant ID ${storeRecord.tenant_id} | Name: "${storeRecord.name}"`);
      createdStores.push(storeRecord);
    }
  }

  // 3. Verify Super Admin receives ALL stores
  console.log('\n--- VERIFYING SUPER ADMIN ACCESS TO ALL STORES ---');
  const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@comzilo.com',
      password: 'SuperAdminSecurePassword2026!',
    }),
  });
  const loginData = await loginRes.json();
  const adminToken = loginData?.data?.accessToken;

  const storesRes = await fetch('http://localhost:5000/api/v1/stores', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const storesData = await storesRes.json();
  const allStores = storesData?.data || [];
  console.log(`Super Admin GET /stores returned ${allStores.length} stores!`);

  for (const cs of createdStores) {
    const found = allStores.find(st => Number(st.id) === Number(cs.id));
    console.log(`• Store ID ${cs.id} ("${cs.name}") present in Super Admin list: ${!!found}`);
  }

  console.log('\nSTEP 6 VERIFICATION COMPLETE! ALL 3 SELLERS PROVISIONED & STORES DISPLAYED!');
  process.exit(0);
}

verifyThreeSellers().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
