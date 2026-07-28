import { test, expect } from '@playwright/test';

test.describe('WhatsApp Business Cloud API Test Sandbox', () => {
  test('Verify WhatsApp Test Message Dispatch to +917382466233', async ({ page }) => {
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

    const recipientPhone = '+917382466233';
    console.log(`[Playwright E2E] Dispatching Test WhatsApp Message to ${recipientPhone}...`);

    // 2. Dispatch Test Message to +917382466233
    const testRes = await page.request.post('http://localhost:5000/api/v1/marketing/whatsapp/send-test-message', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        recipientPhone,
        config: {
          businessName: 'Comzilo Official Store',
          phoneNumberId: '109283746501',
          accessToken: 'eaag_mock_whatsapp_cloud_api_token_xyz987',
        },
      },
    });

    expect(testRes.status()).toBe(200);
    const testData = await testRes.json();
    expect(testData?.success).toBe(true);
    expect(testData?.data?.status).toBe('sent');
    expect(testData?.data?.rawResponse?.contacts[0]?.wa_id).toBe('917382466233');

    console.log(`[Playwright E2E] WhatsApp message successfully dispatched! Ref ID: ${testData?.data?.messageId}`);
    console.log('[Playwright E2E] WhatsApp Business API Test 100% Verified!');
  });
});
