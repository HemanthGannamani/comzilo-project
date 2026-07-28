import { test, expect } from '@playwright/test';
import { loginAsSeller } from './test-helpers';

test.describe('Seller Panel - Sales Orders Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('1. Sales Orders Directory Audit', async ({ page }) => {
    await page.goto('/orders');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Order|Sales/i);
  });

  test('2. Sales Returns Audit', async ({ page }) => {
    await page.goto('/sales/returns');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Return|RMA/i);
  });
});
