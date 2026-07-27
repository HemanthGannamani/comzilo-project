import { test, expect } from '@playwright/test';

test.describe('Phase 3 - Enterprise Payment Gateway & Transaction Management E2E Suite', () => {

  test('COD & Razorpay Payment Verification Flow', async ({ page }) => {
    // 1. Customer Login
    await page.goto('http://localhost:5174/login');
    await page.fill('input[name="email"]', 'customer@example.com');
    await page.fill('input[name="password"]', 'CustomerPassword123!');
    await page.click('button[type="submit"]');

    // 2. Customer Invoices & Payment History
    await page.goto('http://localhost:5174/account/invoices');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Invoices & Payment History')).toBeVisible();

    // 3. Checkout Page Payment Gateway Verification
    await page.goto('http://localhost:5174/checkout');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Razorpay Gateway')).toBeVisible();
    await expect(page.locator('text=Cash on Delivery (COD)')).toBeVisible();
  });

});
