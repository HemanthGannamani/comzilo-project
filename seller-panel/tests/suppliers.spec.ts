import { test, expect } from '@playwright/test';
import { loginAsSeller } from './test-helpers';

test.describe('Seller Panel - Suppliers Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('1. Suppliers Directory Audit', async ({ page }) => {
    await page.goto('/inventory/suppliers');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Supplier/i);
  });
});
