async function testRolesApi() {
  console.log('--- Testing Roles & Permissions API ---');

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

  console.log('\nFetching GET /api/v1/admin/roles...');
  const rolesRes = await fetch('http://localhost:5000/api/v1/admin/roles', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const rolesData = await rolesRes.json();
  console.log('GET /roles Status:', rolesRes.status);
  console.log('Roles Count:', rolesData?.data?.length);

  console.log('\nFetching GET /api/v1/admin/roles/permissions...');
  const permsRes = await fetch('http://localhost:5000/api/v1/admin/roles/permissions', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const permsData = await permsRes.json();
  console.log('GET /roles/permissions Status:', permsRes.status);
  console.log('Total Permissions Matrix Count:', permsData?.data?.total);

  process.exit(0);
}

testRolesApi().catch(err => {
  console.error(err);
  process.exit(1);
});
