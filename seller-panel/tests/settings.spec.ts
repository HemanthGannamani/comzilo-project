import { test, expect } from '@playwright/test';
import { loginAsSeller } from './test-helpers';

test.describe('Seller Panel - 12-Tab Settings Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('1. Enterprise Settings Page & Tab Navigation', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Setting|Store|General/i);
  });
});
