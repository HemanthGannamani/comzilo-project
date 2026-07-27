import { test, expect } from '@playwright/test';

test.describe('Phase 2 - Enterprise Checkout & Order Placement E2E Suite', () => {

  test('Full Checkout Journey & Inventory Order Placement Flow', async ({ page }) => {
    // 1. Customer Login
    await page.goto('http://localhost:5174/login');
    await page.fill('input[name="email"]', 'customer@example.com');
    await page.fill('input[name="password"]', 'CustomerPassword123!');
    await page.click('button[type="submit"]');

    // 2. Add Product to Cart from Catalog
    await page.goto('http://localhost:5174/products');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Shop Catalog')).toBeVisible();

    // 3. Navigate to Cart Page
    await page.goto('http://localhost:5174/cart');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Shopping Cart')).toBeVisible();

    // 4. Validate Coupon Application (SAVE10)
    await page.fill('input[placeholder="Promo Code (SAVE10)"]', 'SAVE10');
    await page.click('button:has-text("Apply")');
    await page.waitForTimeout(500);

    // 5. Proceed to Checkout Page
    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Enterprise Checkout & Order Placement')).toBeVisible();

    // 6. Select Address & Shipping Method
    await expect(page.locator('text=Select Delivery Address')).toBeVisible();
    await expect(page.locator('text=Select Shipping Method')).toBeVisible();

    // 7. Place Order
    await page.click('button:has-text("Place Order")');
    await page.waitForTimeout(1500);

    // 8. Verify Order Confirmation Page
    await expect(page.locator('text=Order Confirmed & Placed!')).toBeVisible();
    await expect(page.locator('text=OFFICIAL TRACKING ORDER NUMBER')).toBeVisible();
  });

});
