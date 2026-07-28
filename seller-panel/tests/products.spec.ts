import { test, expect } from '@playwright/test';
import { loginAsSeller } from './test-helpers';

test.describe('Seller Panel - Products Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('1. Products Directory Audit', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Product/i);
  });
});
