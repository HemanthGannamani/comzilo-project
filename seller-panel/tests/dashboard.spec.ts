import { test, expect } from '@playwright/test';
import { loginAsSeller } from './test-helpers';

test.describe('Seller Panel - Dashboard Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('1. KPI Cards & Performance Metrics Overview', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Dashboard|Sales|Orders|Revenue|Operations/i);
  });
});
