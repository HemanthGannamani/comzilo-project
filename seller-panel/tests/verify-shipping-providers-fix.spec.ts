import { test, expect } from '@playwright/test';

test.describe('Verify Shipping & Logistics Settings Page (/settings/shipping-providers)', () => {
  test('Access Shipping Providers page and verify no Error Boundary crash', async ({ page }) => {
    // 1. Log in on UI
    console.log('[UI Test] Logging in to Seller Panel...');
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="email"], input[type="email"]', 'admin@comzilo.com');
    await page.fill('input[name="password"], input[type="password"]', 'SuperAdminSecurePassword2026!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 }).catch(() => {});

    // 2. Open /settings/shipping-providers
    console.log('[UI Test] Navigating to http://localhost:5173/settings/shipping-providers...');
    await page.goto('http://localhost:5173/settings/shipping-providers');
    await page.waitForLoadState('networkidle');

    // 3. Verify Error Boundary message "Something went wrong" is NOT visible
    const errorText = page.locator('text=Something went wrong');
    await expect(errorText).toHaveCount(0);

    // 4. Verify page heading "Shipping & Logistics Management" is visible
    const heading = page.locator('text=Shipping & Logistics Management');
    await expect(heading).toBeVisible();

    console.log('[UI Test] ✅ Shipping & Logistics Settings Page loaded with 0 errors!');
  });
});
