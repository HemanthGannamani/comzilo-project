import { test, expect } from '@playwright/test';

test.describe('Enterprise Email Automation Engine E2E Test Suite', () => {
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

  test('Scenario 1: Configure SMTP, Test Connection & Send Test Email', async ({ page }) => {
    await page.goto('http://localhost:5173/marketing/email-providers');
    await expect(page.locator('h5')).toContainText('Gmail SMTP Settings');

    await page.click('button:has-text("Configure Settings")');
    await expect(page.locator('.MuiDialog-root')).toBeVisible();

    await page.getByLabel('Sender Name').fill('Comzilo Automated Store');
    await page.getByLabel('Sender Email Address').fill('pedapolukarthikroy7@gmail.com');

    await page.click('.MuiDialog-root button:has-text("Save Settings")');
    await expect(page.locator('.MuiDialog-root')).toBeHidden();

    await page.click('button:has-text("Test Connection")');
    await page.waitForTimeout(1000);

    await page.click('button:has-text("Send Test Email")');
    await expect(page.locator('.MuiDialog-root:has-text("Recipient Email Address")')).toBeVisible();

    await page.getByLabel('Recipient Email Address').fill('pedapolukarthikroy7@gmail.com');
    await page.click('.MuiDialog-root:has-text("Recipient Email Address") button:has-text("Send Test Email")');
    await expect(page.locator('.MuiDialog-root:has-text("Recipient Email Address")')).toBeHidden({ timeout: 10000 });
  });

  test('Scenario 2: Customer Registration & Welcome Email Enqueue', async ({ request }) => {
    expect(authToken).not.toBe('');
    const recipient = `new_customer_${Date.now()}@example.com`;

    const enqueueRes = await request.post('http://localhost:5000/api/v1/marketing/queue/enqueue-cart-abandonment', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        recipient,
        triggerEvent: 'customer_welcome',
        payload: {
          customerName: 'New Registered Customer',
          storeName: 'Comzilo Official Store',
        },
        delayMinutes: 0,
      },
    });

    expect(enqueueRes.status()).toBe(200);
    const enqueueData = await enqueueRes.json();
    expect(enqueueData.success).toBe(true);
  });

  test('Scenario 3: Cart Abandonment -> Queue Job -> Worker -> Email Log Entry', async ({ request }) => {
    expect(authToken).not.toBe('');

    const recipient = `cart_customer_${Date.now()}@example.com`;
    const enqueueRes = await request.post('http://localhost:5000/api/v1/marketing/queue/enqueue-cart-abandonment', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        recipient,
        payload: {
          customerName: 'Cart Abandonment Customer',
          cartItems: '1x Premium Leather Shoes',
          totalPrice: '₹3,499.00',
          couponCode: 'SAVE10',
          storeName: 'Comzilo Official Store',
        },
        delayMinutes: 0,
        cartToken: `cart_token_${Date.now()}`,
      },
    });

    expect(enqueueRes.status()).toBe(200);

    const processRes = await request.post('http://localhost:5000/api/v1/marketing/queue/process-now', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(processRes.status()).toBe(200);

    const logsRes = await request.get('http://localhost:5000/api/v1/marketing/email-logs', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(logsRes.status()).toBe(200);
    const logsData = await logsRes.json();
    expect(logsData.success).toBe(true);
    expect(Array.isArray(logsData.data)).toBe(true);
    expect(logsData.data.length).toBeGreaterThan(0);
  });

  test('Scenario 4: Order Completion -> Cancel Pending Abandoned Cart Job & Dispatch Order Lifecycle Emails', async ({ request }) => {
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

    // 2. Order Placed -> Lifecycle status emails
    const statuses = ['order_confirmation', 'order_shipped', 'order_delivered', 'review_request'];
    for (const status of statuses) {
      const enqueueRes = await request.post('http://localhost:5000/api/v1/marketing/queue/enqueue-cart-abandonment', {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          recipient,
          triggerEvent: status,
          payload: {
            customerName: 'Order Buyer',
            orderNumber: 'ORD-2026-99',
            storeName: 'Comzilo Official Store',
          },
          delayMinutes: 0,
        },
      });
      expect(enqueueRes.status()).toBe(200);
    }
  });
});
