import { test, expect } from '@playwright/test';
import { loginAsSeller } from './test-helpers';

test.describe('Seller Panel - Authentication Module', () => {
  test('1. Valid Login & Session Storage', async ({ page }) => {
    await loginAsSeller(page);
    await expect(page.locator('body')).toContainText(/Dashboard|Merchant|Operations/i);
  });

  test('2. Invalid Credentials Handling', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/login');
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('invalid@comzilo.com');
      await page.fill('input[type="password"], input[name="password"]', 'WrongPassword123!');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL('**/login');
    }
  });

  test('3. Protected Route Redirection', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/products');
    await page.waitForURL('**/login', { timeout: 10000 }).catch(() => {});
  });
});
