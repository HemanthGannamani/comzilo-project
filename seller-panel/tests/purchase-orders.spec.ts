import { test, expect } from '@playwright/test';
import { loginAsSeller } from './test-helpers';

test.describe('Seller Panel - Purchase Orders & GRN/GIN Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('1. Purchase Orders Audit', async ({ page }) => {
    await page.goto('/inventory/purchase-orders');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Purchase Order|PO/i);
  });

  test('2. Goods Receipt (GRN) Audit', async ({ page }) => {
    await page.goto('/inventory/grn');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Goods Receipt|GRN/i);
  });
});
