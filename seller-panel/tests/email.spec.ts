import { test, expect } from '@playwright/test';
import { loginAsSeller } from './test-helpers';

test.describe('Seller Panel - Email Marketing & Providers Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('1. Email Providers Audit', async ({ page }) => {
    await page.goto('/marketing/email-providers');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Email|Provider/i);
  });

  test('2. Email Templates Audit', async ({ page }) => {
    await page.goto('/marketing/email-templates');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Template|Email/i);
  });

  test('3. Email Logs Audit', async ({ page }) => {
    await page.goto('/marketing/email-logs');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Email|Log/i);
  });
});
