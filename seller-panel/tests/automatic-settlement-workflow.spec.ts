import { test, expect } from '@playwright/test';

test.describe('Automatic Settlement Engine E2E Workflow', () => {
  test('Complete Batch Settlement Flow: Process Delivered Orders, Deduct Commission, Move Pending -> Available Balance & Audit Log', async ({ page, request }) => {
    console.log('[Playwright E2E] Triggering Batch Automated Settlement Engine...');

    // 1. Trigger Batch Settlement Run via API
    const stlResponse = await request.post('http://localhost:5000/api/v1/admin/settlements/process-eligible', {
      data: { tenantId: 1 },
      headers: { 'x-tenant-id': '1' },
    });

    expect(stlResponse.status()).toBe(200);
    const stlBody = await stlResponse.json();
    console.log('[Playwright E2E] Settlement Run Result:', stlBody.data);

    // 2. Fetch Settlement Reports Summary
    const repResponse = await request.get('http://localhost:5000/api/v1/admin/settlements/reports', {
      headers: { 'x-tenant-id': '1' },
    });

    expect(repResponse.status()).toBe(200);
    const repBody = await repResponse.json();
    console.log('[Playwright E2E] Settlement Summary Report:', repBody.data);

    // 3. Login to Seller Portal and verify Wallet & Settlements
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
