import { test, expect } from '@playwright/test';

test.describe('Phase 5 - Enterprise Reports, Analytics & BI E2E Suite', () => {

  test('Reports Workspace & Export Verification Flow', async ({ page }) => {
    // 1. Seller Login & Navigation
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'seller@example.com');
    await page.fill('input[type="password"]', 'SellerPassword123!');
    await page.click('button[type="submit"]');

    // 2. Navigate to Reports Workspace
    await page.goto('http://localhost:5173/reports');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Enterprise Reports, Analytics & Business Intelligence')).toBeVisible();

    // 3. Verify KPI Cards & Filter Controls
    await expect(page.locator('text=GROSS REVENUE')).toBeVisible();
    await expect(page.locator('text=TOTAL ORDERS')).toBeVisible();
    await expect(page.locator('text=PAYMENT SUCCESS RATE')).toBeVisible();

    // 4. Verify Export Action Buttons
    await expect(page.locator('button:has-text("CSV")')).toBeVisible();
    await expect(page.locator('button:has-text("Schedule Delivery")')).toBeVisible();
  });

});
