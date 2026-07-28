import { test, expect } from '@playwright/test';
import { loginAsSeller } from './test-helpers';

test.describe('Seller Panel - Standalone Reports Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('1. Standalone Reports Audit', async ({ page }) => {
    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Report|Analytics|Sales/i);
  });
});
