import { test, expect } from '@playwright/test';
import { loginAsSeller } from './test-helpers';

test.describe('Seller Panel - Customers Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('1. Customer Directory Audit', async ({ page }) => {
    await page.goto('/customers');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Customer/i);
  });
});
