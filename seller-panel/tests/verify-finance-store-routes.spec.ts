import { test, expect } from '@playwright/test';

test.describe('Verify Finance & Store Submenu Navigation (No Dashboard Redirects)', () => {
  test('Access Taxes, Expenses, Profit & Loss, Reviews, Support Tickets, Staff, and Loyalty pages', async ({ page }) => {
    // 1. Log in on UI
    console.log('[UI Test] Logging in to Seller Panel...');
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="email"], input[type="email"]', 'admin@comzilo.com');
    await page.fill('input[name="password"], input[type="password"]', 'SuperAdminSecurePassword2026!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 }).catch(() => {});

    // 2. Test /finance/taxes
    console.log('[UI Test] 1/7 Navigating to Taxes Page (http://localhost:5173/finance/taxes)...');
    await page.goto('http://localhost:5173/finance/taxes');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/finance/taxes');
    await expect(page.locator('text=Tax Rules & Rates')).toBeVisible();
    console.log('[UI Test] ✅ Taxes Page loaded with 0 redirects!');

    // 3. Test /finance/expenses
    console.log('[UI Test] 2/7 Navigating to Expenses Page (http://localhost:5173/finance/expenses)...');
    await page.goto('http://localhost:5173/finance/expenses');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/finance/expenses');
    await expect(page.locator('text=Expense Directory')).toBeVisible();
    console.log('[UI Test] ✅ Expenses Page loaded with 0 redirects!');

    // 4. Test /finance/pnl
    console.log('[UI Test] 3/7 Navigating to Profit & Loss Page (http://localhost:5173/finance/pnl)...');
    await page.goto('http://localhost:5173/finance/pnl');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/finance/pnl');
    await expect(page.locator('text=Profit & Loss Statement')).toBeVisible();
    console.log('[UI Test] ✅ Profit & Loss Page loaded with 0 redirects!');

    // 5. Test /store/reviews
    console.log('[UI Test] 4/7 Navigating to Reviews Page (http://localhost:5173/store/reviews)...');
    await page.goto('http://localhost:5173/store/reviews');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/store/reviews');
    await expect(page.locator('text=Product Reviews & Ratings')).toBeVisible();
    console.log('[UI Test] ✅ Reviews Page loaded with 0 redirects!');

    // 6. Test /store/support-tickets
    console.log('[UI Test] 5/7 Navigating to Support Tickets Page (http://localhost:5173/store/support-tickets)...');
    await page.goto('http://localhost:5173/store/support-tickets');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/store/support-tickets');
    await expect(page.getByRole('heading', { name: 'Customer Support Tickets' })).toBeVisible();
    console.log('[UI Test] ✅ Support Tickets Page loaded with 0 redirects!');

    // 7. Test /store/staff
    console.log('[UI Test] 6/7 Navigating to Staff Management Page (http://localhost:5173/store/staff)...');
    await page.goto('http://localhost:5173/store/staff');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/store/staff');
    await expect(page.locator('text=Staff & User Management')).toBeVisible();
    console.log('[UI Test] ✅ Staff Management Page loaded with 0 redirects!');

    // 8. Test /marketing/loyalty
    console.log('[UI Test] 7/7 Navigating to Loyalty Program Page (http://localhost:5173/marketing/loyalty)...');
    await page.goto('http://localhost:5173/marketing/loyalty');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/marketing/loyalty');
    await expect(page.locator('text=Customer Loyalty & Rewards Program')).toBeVisible();
    console.log('[UI Test] ✅ Loyalty Program Page loaded with 0 redirects!');

    console.log('[UI Test] 🎉 ALL 7 FINANCE & STORE SUBMENU PAGES LOADED PERFECTLY WITH ZERO DASHBOARD REDIRECTS!');
  });
});
