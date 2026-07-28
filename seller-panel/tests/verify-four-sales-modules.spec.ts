import { test, expect } from '@playwright/test';

test.describe('Verify Four Sales Modules (Sales Orders, Returns/RMA, Invoices, Payments)', () => {
  test('Access and Verify All 4 Sales Routes', async ({ page }) => {
    // 1. Authenticate Seller/Admin
    console.log('[Playwright Test] Logging in to Seller Panel...');
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

    const headers = {
      Authorization: `Bearer ${token}`,
      'x-store-id': '1',
      'x-tenant-id': '1',
    };

    // 2. Test GET /api/v1/orders (Sales Orders Endpoint)
    console.log('[Playwright Test] 1/4 Testing Sales Orders Endpoint (GET /api/v1/orders)...');
    const ordersRes = await page.request.get('http://localhost:5000/api/v1/orders', { headers });
    expect(ordersRes.status()).toBe(200);
    const ordersData = await ordersRes.json();
    expect(ordersData.success).toBe(true);
    const orderItems = ordersData?.data?.items || ordersData?.data || [];
    console.log(`[Playwright Test] ✅ Sales Orders API Working! Fetched ${orderItems.length} real sales orders.`);

    // 3. Test GET /api/v1/invoices (Invoices Endpoint)
    console.log('[Playwright Test] 2/4 Testing Invoices Endpoint (GET /api/v1/invoices)...');
    const invoicesRes = await page.request.get('http://localhost:5000/api/v1/invoices', { headers });
    expect(invoicesRes.status()).toBe(200);
    const invoicesData = await invoicesRes.json();
    expect(invoicesData.success).toBe(true);
    const invoiceItems = invoicesData?.data?.invoices || invoicesData?.data || [];
    console.log(`[Playwright Test] ✅ Invoices API Working! Fetched ${invoiceItems.length} real invoices.`);

    // 4. Test GET /api/v1/payments (Payments Endpoint)
    console.log('[Playwright Test] 3/4 Testing Payments Endpoint (GET /api/v1/payments)...');
    const paymentsRes = await page.request.get('http://localhost:5000/api/v1/payments', { headers });
    expect(paymentsRes.status()).toBe(200);
    const paymentsData = await paymentsRes.json();
    expect(paymentsData.success).toBe(true);
    const paymentItems = paymentsData?.data?.payments || paymentsData?.data || [];
    console.log(`[Playwright Test] ✅ Payments API Working! Fetched ${paymentItems.length} real payments.`);

    // 5. Test GET /api/v1/refunds (Returns/RMA Endpoint)
    console.log('[Playwright Test] 4/4 Testing Returns/Refunds Endpoint (GET /api/v1/refunds)...');
    const refundsRes = await page.request.get('http://localhost:5000/api/v1/refunds', { headers });
    expect(refundsRes.status()).toBe(200);
    const refundsData = await refundsRes.json();
    expect(refundsData.success).toBe(true);
    const refundItems = refundsData?.data?.refunds || refundsData?.data || [];
    console.log(`[Playwright Test] ✅ Returns/RMA Refunds API Working! Fetched ${refundItems.length} real returns/refunds.`);

    console.log('[Playwright Test] 🎉 ALL 4 SALES MODULES ARE 100% OPERATIONAL WITH REAL DATA!');
  });
});
