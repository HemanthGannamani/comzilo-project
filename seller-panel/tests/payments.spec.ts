import { test, expect } from '@playwright/test';
import { loginAsSeller } from './test-helpers';

test.describe('Seller Panel - Payments & Refunds Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('1. Payments Directory Audit', async ({ page }) => {
    await page.goto('/payments');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Payment/i);
  });

  test('2. Finance Refunds Audit', async ({ page }) => {
    await page.goto('/finance/refunds');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Refund|Finance/i);
  });
});
