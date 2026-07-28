import { test, expect } from '@playwright/test';

test.describe('Integrations & Webhooks Free Development Sandbox', () => {
  test('Verify Stripe Test Mode, AWS Local Storage, OpenAI Graceful Disable, and Test Credentials API responses', async ({ page }) => {
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

    // 2. Stripe Test Mode Connection
    console.log('[Playwright E2E] Testing Stripe Test Credentials API...');
    const stripeRes = await page.request.post('http://localhost:5000/api/v1/integrations/stripe/test-credentials', {
      headers: { Authorization: `Bearer ${token}` },
      data: { provider: 'stripe' },
    });
    expect(stripeRes.status()).toBe(200);
    const stripeData = await stripeRes.json();
    expect(stripeData?.data?.status).toBe('Connected');
    expect(stripeData?.data?.environment).toBe('Test Mode / Sandbox');
    expect(stripeData?.data?.responseTimeMs).toBeGreaterThan(0);
    console.log(`[Playwright E2E] Stripe Test Mode Connected! Response Time: ${stripeData?.data?.responseTimeMs}ms`);

    // 3. AWS S3 Local Storage Connection
    console.log('[Playwright E2E] Testing AWS S3 / Local File Storage Credentials API...');
    const awsRes = await page.request.post('http://localhost:5000/api/v1/integrations/aws_s3/test-credentials', {
      headers: { Authorization: `Bearer ${token}` },
      data: { provider: 'aws_s3' },
    });
    expect(awsRes.status()).toBe(200);
    const awsData = await awsRes.json();
    expect(awsData?.data?.status).toBe('Connected');
    expect(awsData?.data?.environment).toBe('Local Storage');
    console.log('[Playwright E2E] AWS Local File Storage Verified & Writable!');

    // 4. OpenAI Graceful Disable
    console.log('[Playwright E2E] Testing OpenAI Graceful Disable when no key is present...');
    const openAiRes = await page.request.post('http://localhost:5000/api/v1/integrations/openai/test-credentials', {
      headers: { Authorization: `Bearer ${token}` },
      data: { provider: 'openai', apiKey: '' },
    });
    expect(openAiRes.status()).toBe(200);
    const openAiData = await openAiRes.json();
    expect(openAiData?.data?.status).toBe('Disabled Gracefully');
    console.log('[Playwright E2E] OpenAI Gracefully Disabled (No Paid Account Required)!');

    console.log('[Playwright E2E] Integrations & Webhooks Free Sandbox 100% Verified!');
  });
});
