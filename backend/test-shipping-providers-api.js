async function testShippingProvidersApi() {
  console.log('--- Testing Admin Shipping Providers API ---');

  const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@comzilo.com',
      password: 'SuperAdminSecurePassword2026!',
    }),
  });

  const loginData = await loginRes.json();
  const token = loginData?.data?.tokens?.accessToken || loginData?.data?.accessToken;
  console.log('Login Status:', loginRes.status);

  console.log('\nFetching GET /api/v1/admin/shipping-providers/providers...');
  const getRes = await fetch('http://localhost:5000/api/v1/admin/shipping-providers/providers', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const getData = await getRes.json();
  console.log('GET /providers Status:', getRes.status);
  console.log('Providers Count:', getData?.data?.length);
  if (getData?.data?.length > 0) {
    console.log('First Provider:', getData.data[0]);

    const targetId = getData.data[0].id;
    const nextStatus = !getData.data[0].isActive;
    console.log(`\nToggling Provider ID ${targetId} status to ${nextStatus}...`);

    const patchRes = await fetch(`http://localhost:5000/api/v1/admin/shipping-providers/providers/${targetId}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive: nextStatus }),
    });

    const patchData = await patchRes.json();
    console.log('PATCH Status:', patchRes.status);
    console.log('PATCH Response:', patchData);
  }

  process.exit(0);
}

testShippingProvidersApi().catch(err => {
  console.error(err);
  process.exit(1);
});
