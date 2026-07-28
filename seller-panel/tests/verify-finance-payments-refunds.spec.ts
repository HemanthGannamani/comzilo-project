import { test, expect } from '@playwright/test';

test.describe('Verify Disambiguated Finance Payments & Finance Refunds Routes', () => {
  test('Access /finance/payments and /finance/refunds without navigating to Sales modules', async ({ page }) => {
    // 1. Log in on UI
    console.log('[UI Test] Logging in to Seller Panel...');
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="email"], input[type="email"]', 'admin@comzilo.com');
    await page.fill('input[name="password"], input[type="password"]', 'SuperAdminSecurePassword2026!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 }).catch(() => {});

    // 2. Test /finance/payments
    console.log('[UI Test] Navigating to Finance Payments (http://localhost:5173/finance/payments)...');
    await page.goto('http://localhost:5173/finance/payments');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/finance/payments');
    await expect(page.locator('text=Financial Payments & Payout Reconciliation')).toBeVisible();
    console.log('[UI Test] ✅ Finance Payments Page loaded with 0 cross-navigation!');

    // 3. Test /finance/refunds
    console.log('[UI Test] Navigating to Finance Refunds (http://localhost:5173/finance/refunds)...');
    await page.goto('http://localhost:5173/finance/refunds');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/finance/refunds');
    await expect(page.locator('text=Financial Refunds & Disbursements')).toBeVisible();
    console.log('[UI Test] ✅ Finance Refunds Page loaded with 0 cross-navigation!');

    console.log('[UI Test] 🎉 FINANCE PAYMENTS & REFUNDS ARE COMPLETELY DISAMBIGUATED AND OPERATIONAL!');
  });
});
