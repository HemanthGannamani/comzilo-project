async function testAnalyticsReal() {
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

  const anaRes = await fetch('http://localhost:5000/api/v1/admin/shipping-providers/analytics', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const anaData = await anaRes.json();
  console.log('Shipping Analytics Real DB:', anaData?.data);

  const invRes = await fetch('http://localhost:5000/api/v1/admin/inventory/analytics', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const invData = await invRes.json();
  console.log('Inventory Analytics Real DB:', invData?.data);

  process.exit(0);
}

testAnalyticsReal().catch(err => {
  console.error(err);
  process.exit(1);
});
