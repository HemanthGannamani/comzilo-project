import { test, expect } from '@playwright/test';
import { loginAsSeller } from './test-helpers';

test.describe('Seller Panel - Warehouses & Locations Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('1. Warehouses Directory Audit', async ({ page }) => {
    await page.goto('/inventory/warehouses');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Warehouse/i);
  });

  test('2. Warehouse Locations Audit', async ({ page }) => {
    await page.goto('/inventory/locations');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Location|Warehouse/i);
  });
});
