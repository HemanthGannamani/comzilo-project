import { Page, expect } from '@playwright/test';

export async function loginAsSeller(page: Page) {
  await page.goto('/login');
  await page.waitForLoadState('domcontentloaded');

  if (page.url().includes('/login')) {
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    if (await emailInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await emailInput.fill('admin@comzilo.com');
      await page.fill('input[type="password"], input[name="password"]', 'SuperAdminSecurePassword2026!');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/dashboard', { timeout: 15000 }).catch(() => {});
    }
  }
}
