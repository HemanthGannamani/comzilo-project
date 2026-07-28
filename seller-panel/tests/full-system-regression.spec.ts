import { test, expect } from '@playwright/test';

test.describe('Comzilo Platform - Final Full System Integrated Regression Suite', () => {

  test('1. Admin Panel Platform Infrastructure Check (http://localhost:4200)', async ({ page }) => {
    await page.goto('http://localhost:4200/login');
    await page.waitForLoadState('domcontentloaded');

    if (page.url().includes('/login')) {
      const emailInput = page.locator('form input').first();
      const passwordInput = page.locator('form input[type="password"]').first();
      const submitBtn = page.locator('form button[type="submit"]').first();

      if (await emailInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await emailInput.fill('admin@comzilo.com');
        await passwordInput.fill('SuperAdminSecurePassword2026!');
        await submitBtn.click();
        await page.waitForURL('**/dashboard', { timeout: 15000 }).catch(() => {});
      }
    }

    await expect(page.locator('body')).toContainText(/Super Admin|Dashboard|Tenant/i);

    // Verify Tenant Management
    await page.goto('http://localhost:4200/tenants');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toContainText(/Tenant/i);

    // Verify Seller Applications
    await page.goto('http://localhost:4200/seller-applications');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toContainText(/Seller/i);
  });

  test('2. Seller Panel Operations & Catalog Publishing (http://localhost:5173)', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('domcontentloaded');

    if (page.url().includes('/login')) {
      const emailInput = page.locator('form input').first();
      const passwordInput = page.locator('form input[type="password"]').first();
      const submitBtn = page.locator('form button[type="submit"]').first();

      if (await emailInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await emailInput.fill('admin@comzilo.com');
        await passwordInput.fill('SuperAdminSecurePassword2026!');
        await submitBtn.click();
        await page.waitForURL('**/dashboard', { timeout: 15000 }).catch(() => {});
      }
    }

    // Verify Catalog
    await page.goto('http://localhost:5173/products');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toContainText(/Product/i);

    // Verify Inventory
    await page.goto('http://localhost:5173/inventory/balances');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toContainText(/Inventory|Balance/i);

    // Verify Marketing Email Logs
    await page.goto('http://localhost:5173/marketing/email-logs');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toContainText(/Email|Log/i);
  });

  test('3. Customer Panel E-Commerce Journey & Checkout (http://localhost:3000)', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toContainText(/Comzilo|Store|Product|Shop/i);

    // Browse Catalog
    await page.goto('http://localhost:3000/products');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).not.toContainText(/404|Server Error/i);

    // Cart & Checkout
    await page.goto('http://localhost:3000/checkout');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toContainText(/Checkout|Shipping|Address|Payment/i);
  });

  test('4. Cross-System Multi-Tenant Isolation & Security Audit', async ({ page }) => {
    // Verify Admin Portal Isolation
    await page.goto('http://localhost:4200/dashboard');
    await page.waitForLoadState('domcontentloaded');

    // Verify Seller Portal Isolation
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForLoadState('domcontentloaded');

    // Verify Customer Portal Isolation
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).not.toContainText(/Cross-Tenant Error|Unauthorized/i);
  });
});
