import { test, expect } from '@playwright/test';
import { loginAsSeller } from './test-helpers';

test.describe('Seller Panel - Inventory & Balances Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('1. Inventory Dashboard Audit', async ({ page }) => {
    await page.goto('/inventory/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Inventory|Dashboard|Stock/i);
  });

  test('2. Inventory Balances Audit', async ({ page }) => {
    await page.goto('/inventory/balances');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Inventory|Balance/i);
  });
});
