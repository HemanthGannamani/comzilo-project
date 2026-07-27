import { test, expect } from '@playwright/test';

test.describe('Phase 1 - Enterprise Customer Account Portal E2E Suite', () => {

  test('Complete Verification of Customer Portal & Navigation', async ({ page }) => {
    // 1. Customer Login
    await page.goto('http://localhost:5174/login');
    await page.fill('input[name="email"]', 'customer@example.com');
    await page.fill('input[name="password"]', 'CustomerPassword123!');
    await page.click('button[type="submit"]');

    // 2. Customer Dashboard
    await page.goto('http://localhost:5174/account');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=TOTAL ORDERS')).toBeVisible();

    // 3. My Profile
    await page.goto('http://localhost:5174/account/profile');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=My Profile Details')).toBeVisible();

    // 4. Saved Addresses CRUD
    await page.goto('http://localhost:5174/account/addresses');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Saved Addresses')).toBeVisible();

    // 5. My Orders & Order Details
    await page.goto('http://localhost:5174/account/orders');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=My Orders & Tracking')).toBeVisible();

    // 6. Saved Wishlist
    await page.goto('http://localhost:5174/account/wishlist');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=My Saved Wishlist')).toBeVisible();

    // 7. Notification Center
    await page.goto('http://localhost:5174/account/notifications');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Notification Center')).toBeVisible();

    // 8. Download Invoices
    await page.goto('http://localhost:5174/account/invoices');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Download Billing Invoices')).toBeVisible();

    // 9. Change Password
    await page.goto('http://localhost:5174/account/change-password');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Change Account Password')).toBeVisible();

    // 10. Privacy & Security
    await page.goto('http://localhost:5174/account/privacy');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Active Login Sessions')).toBeVisible();
  });

});
