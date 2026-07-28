async function testPlansApi() {
  try {
    console.log('Testing GET /api/v1/subscription-plans...');
    const getRes = await fetch('http://localhost:5000/api/v1/subscription-plans');
    const getData = await getRes.json();
    console.log('GET Status:', getRes.status);
    console.log('Plans returned:', getData?.data?.length);

    console.log('\nTesting PUT /api/v1/subscription-plans/2 (Starter Plan)...');
    const putRes = await fetch('http://localhost:5000/api/v1/subscription-plans/2', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Starter Tier Pro',
        priceMonthly: 49.0,
        priceYearly: 490.0,
        storeLimit: 2,
        userLimit: 10,
        warehouseLimit: 2,
        features: ['Basic Catalog', 'POS Terminal', 'Standard Email Support', 'Mobile Checkout'],
        trialDays: 14,
        isActive: true,
      }),
    });

    const putData = await putRes.json();
    console.log('PUT Status:', putRes.status);
    console.log('Updated Plan:', JSON.stringify(putData, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testPlansApi();
