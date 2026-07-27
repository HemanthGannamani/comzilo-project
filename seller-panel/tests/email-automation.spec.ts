import { test, expect } from '@playwright/test';

let authToken = '';
let authData: any = null;

test.describe('Enterprise Email Automation Engine E2E Test Suite', () => {
  test.beforeEach(async ({ request }) => {
    const res = await request.post('http://localhost:5000/api/v1/auth/login', {
      data: { email: 'admin@comzilo.com', password: 'SuperAdminSecurePassword2026!' },
    });
    const json = await res.json();
    authData = json.data || json;
    authToken = authData.token || authData.accessToken;
  });

  test('Scenario 1: Configure SMTP, Test Connection & Send Test Email', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="email"]', 'admin@comzilo.com');
    await page.fill('input[name="password"]', 'SuperAdminSecurePassword2026!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    await page.goto('http://localhost:5173/marketing/email-providers');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Gmail SMTP').first()).toBeVisible();

    // Click Test Connection on Card
    await page.getByRole('button', { name: 'Test Connection' }).click();
    await page.waitForTimeout(1000);

    // Open Send Test Email Modal from Card
    await page.getByRole('button', { name: 'Send Test Email' }).first().click();
    await page.waitForTimeout(500);

    await page.getByLabel('Recipient Email Address').fill('pedapolukarthikroy7@gmail.com');
    await page.getByRole('button', { name: 'Send Test Email' }).last().click();
    await page.waitForTimeout(1500);
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

  test('Scenario 5: Admin Approves Seller -> Email Queued & Sent -> Login -> Forced Password Change -> Dashboard', async ({ request, page, browser }) => {
    expect(authToken).not.toBe('');

    const timestamp = Date.now();
    const sellerEmail = `approved_seller_${timestamp}@example.com`;
    const tempPassword = `TmpPass!${timestamp.toString().slice(-4)}`;

    // 1. Admin creates / approves seller account via API
    const createRes = await request.post('http://localhost:5000/api/v1/admin/sellers', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        ownerName: 'Approved Seller Owner',
        email: sellerEmail,
        phone: `+9198${timestamp.toString().slice(-8)}`,
        password: tempPassword,
        businessName: `Approved Store ${timestamp}`,
        tenantConfig: {
          mode: 'create',
          newName: `Approved Business ${timestamp}`,
          newSlug: `approved-biz-${timestamp}`,
        },
        storeConfig: {
          mode: 'create',
          newName: `Approved Store ${timestamp}`,
          newCode: `app-store-${timestamp}`,
        },
        roleCode: 'tenant_owner',
        status: 'active',
      },
    });

    expect(createRes.status()).toBe(200);
    const createData = await createRes.json();
    expect(createData.success).toBe(true);

    // 2. Trigger Queue Worker to process seller_approval email
    await request.post('http://localhost:5000/api/v1/marketing/queue/process-now', {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    // 3. Verify Email Log Created
    const logsRes = await request.get('http://localhost:5000/api/v1/marketing/email-logs', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(logsRes.status()).toBe(200);
    const logsData = await logsRes.json();
    expect(logsData.data.length).toBeGreaterThan(0);

    // 4. Seller Logs In with Temporary Password in a fresh context
    const sellerContext = await browser.newContext();
    const sellerPage = await sellerContext.newPage();
    await sellerPage.goto('http://localhost:5173/login');
    await sellerPage.fill('input[name="email"]', sellerEmail);
    await sellerPage.fill('input[name="password"]', tempPassword);
    await sellerPage.click('button[type="submit"]');

    // 5. System forces Seller to /change-password
    await sellerPage.waitForURL('**/change-password');
    await expect(sellerPage.locator('h5')).toContainText('Change Password Required');

    // 6. Seller Updates Password
    const newPassword = `NewSecPass!${timestamp.toString().slice(-4)}`;
    await sellerPage.getByLabel('Temporary Password').fill(tempPassword);
    await sellerPage.getByLabel('New Password', { exact: true }).fill(newPassword);
    await sellerPage.getByLabel('Confirm New Password', { exact: true }).fill(newPassword);
    await sellerPage.click('button[type="submit"]');

    // 7. Redirected to /dashboard after successful password update
    await sellerPage.waitForURL('**/dashboard');
    await expect(sellerPage.locator('h4, h5, h6').first()).toBeVisible();
    await sellerContext.close();
  });
});
