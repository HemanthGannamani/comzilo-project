import { test, expect } from '@playwright/test';
import { loginAsSeller } from './test-helpers';

test.describe('Seller Panel - Comprehensive Regression Suite', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('1. Navigation Routes Health Check', async ({ page }) => {
    const routes = [
      '/products',
      '/categories',
      '/tags',
      '/orders',
      '/customers',
      '/invoices',
      '/payments',
      '/inventory/dashboard',
      '/inventory/warehouses',
      '/inventory/balances',
      '/marketing/dashboard',
      '/marketing/email-providers',
      '/marketing/email-templates',
      '/marketing/campaigns',
      '/marketing/whatsapp',
      '/marketing/coupons',
      '/marketing/email-logs',
      '/finance/payments',
      '/finance/refunds',
      '/reports',
      '/pos',
      '/settings',
    ];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('body')).not.toContainText(/404|Server Error/i);
    }
  });
});
