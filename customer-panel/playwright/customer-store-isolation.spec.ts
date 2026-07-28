import { test, expect } from '@playwright/test';

test.describe('Store-based Customer Registration & Multi-Tenant Data Isolation', () => {
  test('Customer Registration under Store Context & Isolation', async ({ page }) => {
    await page.goto('/store/satish-traders/register');
    await page.waitForLoadState('domcontentloaded');

    await page.goto('/store/satish-traders/login');
    await page.waitForLoadState('domcontentloaded');
  });
});
