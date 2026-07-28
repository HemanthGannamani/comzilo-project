import { test, expect } from '@playwright/test';
import { loginAsSeller } from './test-helpers';

test.describe('Seller Panel - Categories & Brands Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('1. Categories Directory Audit', async ({ page }) => {
    await page.goto('/categories');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Categor/i);
  });

  test('2. Brands & Tags Audit', async ({ page }) => {
    await page.goto('/tags');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Brand|Tag/i);
  });
});
