import { test, expect } from '@playwright/test';

test.describe('Full Platform Comprehensive Navigation & Safety Audit E2E Suite', () => {
  test('Verify Admin Panel all financial routes and sidebar navigation render cleanly without errors', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', err => pageErrors.push(`[ADMIN ERROR] ${err.message}`));

    // 1. Open Admin Panel Root
    await page.goto('http://localhost:4200/dashboard');
    await page.waitForTimeout(1000);

    const adminRoutes = [
      '/dashboard',
      '/tenants',
      '/seller-applications',
      '/sellers',
      '/stores',
      '/inventory-management',
      '/subscriptions',
      '/finance',
      '/seller-bank-accounts',
      '/payouts',
      '/withdrawals',
      '/settlements',
      '/commission-settings',
      '/shipping-providers',
      '/reports',
      '/feature-flags',
      '/settings',
      '/integrations',
      '/logs',
      '/health',
      '/notifications',
    ];

    for (const route of adminRoutes) {
      await page.goto(`http://localhost:4200${route}`);
      await page.waitForTimeout(500);
      expect(pageErrors.length).toBe(0);
    }
    console.log('[Playwright Full Audit] All 21 Admin Panel routes opened cleanly with 0 errors!');
  });

  test('Verify Seller Panel all financial routes and sidebar navigation render cleanly without errors', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', err => pageErrors.push(`[SELLER ERROR] ${err.message}`));

    const sellerRoutes = [
      '/dashboard',
      '/finance/dashboard',
      '/customer/payments',
      '/wallet',
      '/finance/bank-account',
      '/withdrawals',
      '/finance/payments',
      '/settings/subscription',
      '/products',
      '/categories',
      '/orders',
      '/customers',
      '/analytics',
      '/settings',
    ];

    for (const route of sellerRoutes) {
      await page.goto(`http://localhost:5173${route}`);
      await page.waitForTimeout(500);
      expect(pageErrors.length).toBe(0);
    }
    console.log('[Playwright Full Audit] All 14 Seller Panel routes opened cleanly with 0 errors!');
  });
});
