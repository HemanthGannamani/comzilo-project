async function testSuperAdminStores() {
  try {
    console.log('Logging in as Super Admin (admin@comzilo.com)...');
    const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@comzilo.com',
        password: 'SuperAdminSecurePassword2026!',
      }),
    });

    const loginData = await loginRes.json();
    console.log('Login User Data:', JSON.stringify(loginData?.data?.user || loginData?.user, null, 2));

    const token = loginData?.data?.accessToken || loginData?.accessToken;

    const storesRes = await fetch('http://localhost:5000/api/v1/stores', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const storesData = await storesRes.json();
    console.log('GET /stores Status:', storesRes.status);
    console.log('Total stores returned:', storesData?.data?.length || storesData?.data?.stores?.length || storesData?.data?.count);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testSuperAdminStores();
