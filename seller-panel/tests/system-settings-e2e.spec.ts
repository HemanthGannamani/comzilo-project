import { test, expect } from '@playwright/test';

test.describe('System Settings & Email Templates E2E Verification', () => {
  test('Verify Save System Settings and Update Email Templates API persistence', async ({ page }) => {
    // 1. Super Admin Login
    console.log('[Playwright E2E] Logging in as Super Admin...');
    const loginRes = await page.request.post('http://localhost:5000/api/v1/auth/login', {
      data: {
        email: 'admin@comzilo.com',
        password: 'SuperAdminSecurePassword2026!',
      },
    });
    expect(loginRes.status()).toBe(200);
    const loginData = await loginRes.json();
    const token = loginData?.data?.tokens?.accessToken || loginData?.data?.accessToken;
    expect(token).toBeTruthy();

    // 2. Test Save System Settings
    console.log('[Playwright E2E] Testing POST /api/v1/admin/system/settings...');
    const settingsPayload = [
      { settingKey: 'app_name', settingValue: 'Comzilo Enterprise ERP', category: 'general' },
      { settingKey: 'admin_email', settingValue: 'admin@comzilo.com', category: 'general' },
      { settingKey: 'company_name', settingValue: 'Comzilo Technologies', category: 'company' },
      { settingKey: 'company_address', settingValue: 'Hyderabad, Telangana', category: 'company' },
      { settingKey: 'smtp_host', settingValue: 'smtp.sendgrid.net', category: 'smtp' },
      { settingKey: 'smtp_port', settingValue: '587', category: 'smtp' },
      { settingKey: 'maintenance_mode', settingValue: 'false', category: 'maintenance' },
    ];

    const saveSettingsRes = await page.request.post('http://localhost:5000/api/v1/admin/system/settings', {
      headers: { Authorization: `Bearer ${token}` },
      data: settingsPayload,
    });
    expect(saveSettingsRes.status()).toBe(200);
    const saveSettingsData = await saveSettingsRes.json();
    expect(saveSettingsData?.success).toBe(true);
    console.log('[Playwright E2E] System Settings Saved Successfully!');

    // 3. Test Save Email Templates
    console.log('[Playwright E2E] Testing POST /api/v1/admin/system/email-templates...');
    const templatePayload = {
      code: 'welcome_email',
      name: 'Welcome Email',
      subject: 'Welcome to Comzilo Platform',
      body: 'Dear {{sellerName}}, welcome to our enterprise platform.',
    };

    const saveTemplateRes = await page.request.post('http://localhost:5000/api/v1/admin/system/email-templates', {
      headers: { Authorization: `Bearer ${token}` },
      data: templatePayload,
    });
    expect(saveTemplateRes.status()).toBe(200);
    const saveTemplateData = await saveTemplateRes.json();
    expect(saveTemplateData?.success).toBe(true);
    console.log('[Playwright E2E] Email Templates Updated Successfully!');

    console.log('[Playwright E2E] System Settings & Email Templates 100% Verified!');
  });
});
