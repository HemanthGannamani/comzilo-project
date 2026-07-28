async function testSalesEndpoints() {
  try {
    console.log('Logging in as seller satishveeravalli2004@gmail.com...');
    const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'satishveeravalli2004@gmail.com',
        password: 'Satish@123',
      }),
    });

    const loginData = await loginRes.json();
    const token = loginData?.data?.accessToken || loginData?.accessToken;
    const user = loginData?.data?.user;

    if (!token) {
      console.error('Seller login failed!');
      return;
    }
    console.log('Seller login successful! User Tenant:', user?.tenantId);

    const headers = {
      Authorization: `Bearer ${token}`,
      'x-tenant-id': String(user?.tenantId || 41),
      'x-store-id': '39',
    };

    const endpoints = [
      '/customers',
      '/orders',
      '/invoices',
      '/payments',
      '/refunds',
    ];

    for (const ep of endpoints) {
      const res = await fetch(`http://localhost:5000/api/v1${ep}`, { headers });
      const data = await res.json();
      console.log(`Endpoint GET ${ep}: Status ${res.status}`);
      console.log(`Data summary:`, JSON.stringify(data).slice(0, 300));
      console.log('--------------------------------------------------');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testSalesEndpoints();
