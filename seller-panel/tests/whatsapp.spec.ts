import { test, expect } from '@playwright/test';
import { loginAsSeller } from './test-helpers';

test.describe('Seller Panel - WhatsApp Marketing Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('1. WhatsApp Config & Campaign Audit', async ({ page }) => {
    await page.goto('/marketing/whatsapp');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/WhatsApp/i);
  });
});
