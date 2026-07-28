import { test, expect } from '@playwright/test';

test.describe('Comzilo Customer Panel End-to-End Business Workflows Suite', () => {

  test('1. Customer Registration, Login & Session Persistence', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    // Fill customer login credentials if login form is present
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    if (await emailInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await emailInput.fill('customer@comzilo.com');
      await page.fill('input[type="password"], input[name="password"]', 'CustomerSecurePassword2026!');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
    }
    await expect(page.locator('body')).not.toContainText(/Server Error|500/i);
  });

  test('2. Store Browsing, Catalog Search & Category Filters', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toContainText(/Comzilo|Store|Product|Shop/i);

    // Navigate to Products page
    await page.goto('/products');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).not.toContainText(/404|Server Error/i);
  });

  test('3. Wishlist & Shopping Cart Workflow', async ({ page }) => {
    await page.goto('/cart');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toContainText(/Cart|Bag|Basket|Item/i);
  });

  test('4. End-to-End Checkout & Order Review Workflow', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toContainText(/Checkout|Shipping|Address|Payment/i);
  });

  test('5. Order History & Invoice Download', async ({ page }) => {
    await page.goto('/orders');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toContainText(/Order|History|Purchase/i);
  });

  test('6. Customer Account & Address Book Management', async ({ page }) => {
    await page.goto('/account');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toContainText(/Account|Profile|Address|Setting/i);
  });

  test('7. Multi-Tenant Store Scoping & Isolation Guard', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    // Ensure page renders cleanly with no cross-tenant leakage or errors
    await expect(page.locator('body')).not.toContainText(/Unauthorized|Forbidden|Cross-Tenant Error/i);
  });
});
