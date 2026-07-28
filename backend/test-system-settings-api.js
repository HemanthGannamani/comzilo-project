async function testSystemSettingsApi() {
  console.log('--- Testing System Settings & Email Templates API ---');

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

  console.log('\nTesting POST /api/v1/admin/system/settings...');
  const settingsRes = await fetch('http://localhost:5000/api/v1/admin/system/settings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      { settingKey: 'app_name', settingValue: 'Comzilo Enterprise ERP', category: 'general' },
      { settingKey: 'admin_email', settingValue: 'admin@comzilo.com', category: 'general' },
    ]),
  });
  const settingsData = await settingsRes.json();
  console.log('POST /settings Status:', settingsRes.status);
  console.log('POST /settings Response:', settingsData);

  console.log('\nTesting POST /api/v1/admin/system/email-templates...');
  const templateRes = await fetch('http://localhost:5000/api/v1/admin/system/email-templates', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: 'welcome_email',
      name: 'Welcome Email',
      subject: 'Welcome to Comzilo',
      body: 'Dear {{sellerName}}, welcome to our platform.',
    }),
  });
  const templateData = await templateRes.json();
  console.log('POST /email-templates Status:', templateRes.status);
  console.log('POST /email-templates Response:', templateData);

  process.exit(0);
}

testSystemSettingsApi().catch(err => {
  console.error(err);
  process.exit(1);
});
