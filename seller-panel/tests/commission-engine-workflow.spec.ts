import { test, expect } from '@playwright/test';

test.describe('Enterprise SaaS Commission Engine E2E Workflow', () => {
  test('Verify Automatic Commission Calculation & Formula ($100 Order -> $82 Net Payout)', async ({ page, request }) => {
    console.log('[Playwright E2E] Testing Commission Engine Calculation API...');

    // 1. Calculate Payout via API
    const calcResponse = await request.post('http://localhost:5000/api/v1/commission/calculate', {
      data: {
        orderId: 9999,
        orderTotal: 100.00,
        subtotal: 100.00,
      },
      headers: {
        'x-tenant-id': '1',
      },
    });

    expect(calcResponse.status()).toBe(200);
    const body = await calcResponse.json();
    const data = body.data;

    console.log('[Playwright E2E] Calculation Result:', data);

    // Verify formula values:
    // Order = $100, Commission = 10% ($10), Gateway Fee = $3, Shipping = $5 -> Seller Receives = $82
    expect(data.orderTotal).toBe(100);
    expect(data.platformCommission).toBe(10);
    expect(data.gatewayFee).toBe(3);
    expect(data.shippingFee).toBe(5);
    expect(data.netSellerPayout).toBe(82);

    console.log('[Playwright E2E] Verified exact formula match: $100 - $10 (Comm) - $3 (GW) - $5 (Ship) = $82 Payout!');

    // 2. Seller UI Login Verification
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'bordmart0@gmail.com');
    await page.fill('input[type="password"]', 'Sel831Pass!570');
    await page.click('button:has-text("Sign In")');

    if (page.url().includes('/change-password')) {
      await page.fill('input[name="currentPassword"], input[placeholder*="Current"]', 'Sel831Pass!570');
      await page.fill('input[name="newPassword"], input[placeholder*="New"]', 'Sel831Pass!570');
      await page.fill('input[name="confirmPassword"], input[placeholder*="Confirm"]', 'Sel831Pass!570');
      await page.click('button:has-text("Update Password")');
    }

    await page.waitForURL('**/dashboard', { timeout: 10000 });
    console.log('[Playwright E2E] Seller logged in successfully!');

    await page.goto('http://localhost:5173/finance/wallet');
    await page.waitForSelector('text=Seller Wallet & Settlement Hub', { timeout: 10000 });
    console.log('[Playwright E2E] Wallet & Settlement Hub loaded cleanly!');
  });
});
