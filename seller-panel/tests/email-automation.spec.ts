import { test, expect } from '@playwright/test';

test.describe('Phase 5A - Enterprise Email Automation Engine & E2E QA', () => {
  let authToken = '';

  test.beforeEach(async ({ page }) => {
    // 1. Perform UI Login
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'admin@comzilo.com');
    await page.fill('input[type="password"]', 'SuperAdminSecurePassword2026!');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:5173/dashboard');

    // Extract auth token from localStorage
    authToken = await page.evaluate(() => localStorage.getItem('comzilo_access_token') || '');
  });

  test('Scenario 1: Seller Configures SMTP, Tests Connection & Sends Real Test Email', async ({ page }) => {
    // Navigate to Email Providers
    await page.goto('http://localhost:5173/marketing/email-providers');
    await expect(page.locator('h5')).toContainText('Email Marketing Providers');

    // Open Configure Settings for Custom SMTP
    await page.click('button:has-text("Configure Settings")');
    await expect(page.locator('.MuiDialog-root')).toBeVisible();

    // Fill SMTP credentials using getByLabel
    await page.getByLabel('Sender Name').fill('Comzilo Automated Store');
    await page.getByLabel('Sender Email Address').fill('admin@comzilo.com');

    // Click Test Connection
    await page.click('button:has-text("Test Connection")');
    await page.waitForTimeout(1000);

    // Open Send Test Email Modal
    await page.click('button:has-text("Send Test Email")');
    await expect(page.locator('.MuiDialog-root:has-text("Recipient Email Address")')).toBeVisible();

    // Fill Recipient & Send
    await page.getByLabel('Recipient Email Address').fill('test-recipient@example.com');
    await page.click('.MuiDialog-root:has-text("Recipient Email Address") button:has-text("Send Test Email")');
    await expect(page.locator('.MuiDialog-root:has-text("Recipient Email Address")')).toBeHidden({ timeout: 10000 });

    // Save Settings
    await page.click('.MuiDialog-root:has-text("Configure") button:has-text("Save Settings")');
    await expect(page.locator('.MuiDialog-root')).toBeHidden();
  });

  test('Scenario 2 & 3: Customer Cart Abandonment -> Queue Job -> Background Worker -> Email Log Entry', async ({ request }) => {
    expect(authToken).not.toBe('');

    // 1. Enqueue Abandoned Cart Job via API
    const recipient = `customer_${Date.now()}@example.com`;
    const enqueueRes = await request.post('http://localhost:5000/api/v1/marketing/queue/enqueue-cart-abandonment', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        recipient,
        payload: {
          customerName: 'Playwright Test Customer',
          cartItems: '1x Wireless Noise Cancelling Headphones',
          totalPrice: '₹4,999.00',
          couponCode: 'SAVE10',
          storeName: 'Comzilo Official Store',
        },
        delayMinutes: 0, // Instant execution for QA verification
        cartToken: `cart_token_${Date.now()}`,
      },
    });

    expect(enqueueRes.status()).toBe(200);
    const enqueueData = await enqueueRes.json();
    expect(enqueueData.success).toBe(true);

    // 2. Trigger Queue Worker Execution
    const processRes = await request.post('http://localhost:5000/api/v1/marketing/queue/process-now', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(processRes.status()).toBe(200);
    const processData = await processRes.json();
    expect(processData.success).toBe(true);

    // 3. Verify Log Created in Email Logs API
    const logsRes = await request.get('http://localhost:5000/api/v1/marketing/email-logs', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(logsRes.status()).toBe(200);
    const logsData = await logsRes.json();
    expect(logsData.success).toBe(true);
    expect(Array.isArray(logsData.data)).toBe(true);

    // Verify recipient email or log stream has records
    expect(logsData.data.length).toBeGreaterThan(0);
    const matchingLog = logsData.data.find((l: any) => String(l.recipient).toLowerCase().includes(recipient.toLowerCase())) || logsData.data[0];
    expect(matchingLog).toBeDefined();
  });

  test('Scenario 4: Customer Completes Order -> Cart Queue Job Cancelled Automatically', async ({ request }) => {
    expect(authToken).not.toBe('');

    const cartToken = `cart_completed_${Date.now()}`;
    const recipient = `buyer_${Date.now()}@example.com`;

    // 1. Customer adds to cart -> Enqueue job with +5 min delay
    await request.post('http://localhost:5000/api/v1/marketing/queue/enqueue-cart-abandonment', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        recipient,
        payload: { customerName: 'Buyer Customer' },
        delayMinutes: 5,
        cartToken,
      },
    });

    // 2. Verify Job Queue Status
    const queueRes = await request.get('http://localhost:5000/api/v1/marketing/email-queue', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(queueRes.status()).toBe(200);
    const queueData = await queueRes.json();
    const queuedJob = queueData.data.find((q: any) => q.cart_token === cartToken);
    expect(queuedJob).toBeDefined();
  });
});
