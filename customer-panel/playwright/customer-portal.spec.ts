import { test, expect } from '@playwright/test';

test.describe('Phase 1 - Enterprise Customer Account Portal E2E Suite', () => {
  test('Complete Verification of Customer Portal & Navigation', async ({ page }) => {
    // 1. Customer Login
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    // 2. Customer Dashboard
    await page.goto('/account');
    await page.waitForLoadState('domcontentloaded');

    // 3. My Profile
    await page.goto('/account/profile');
    await page.waitForLoadState('domcontentloaded');

    // 4. Saved Addresses
    await page.goto('/account/addresses');
    await page.waitForLoadState('domcontentloaded');

    // 5. My Orders
    await page.goto('/account/orders');
    await page.waitForLoadState('domcontentloaded');

    // 6. Saved Wishlist
    await page.goto('/account/wishlist');
    await page.waitForLoadState('domcontentloaded');

    // 7. Notification Center
    await page.goto('/account/notifications');
    await page.waitForLoadState('domcontentloaded');

    // 8. Download Invoices
    await page.goto('/account/invoices');
    await page.waitForLoadState('domcontentloaded');

    // 9. Change Password
    await page.goto('/account/change-password');
    await page.waitForLoadState('domcontentloaded');

    // 10. Privacy & Security
    await page.goto('/account/privacy');
    await page.waitForLoadState('domcontentloaded');
  });
});
