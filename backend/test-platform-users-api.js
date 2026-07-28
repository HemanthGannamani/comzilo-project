async function testPlatformUsersApi() {
  console.log('--- Testing Platform Users API ---');

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

  console.log('\nFetching GET /api/v1/admin/platform-users...');
  const usersRes = await fetch('http://localhost:5000/api/v1/admin/platform-users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const usersData = await usersRes.json();
  console.log('GET /platform-users Status:', usersRes.status);
  console.log('Users Count:', usersData?.data?.length);
  console.log('First User:', JSON.stringify(usersData?.data?.[0], null, 2));

  process.exit(0);
}

testPlatformUsersApi().catch(err => {
  console.error(err);
  process.exit(1);
});
