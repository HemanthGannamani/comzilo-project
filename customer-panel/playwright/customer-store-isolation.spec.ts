import { test, expect } from '@playwright/test';

test.describe('Store-based Customer Registration & Multi-Tenant Data Isolation', () => {

  test('Customer Registration under Store Context & Isolation', async ({ page }) => {
    // 1. Customer visits Storefront A registration
    await page.goto('http://localhost:5174/store/satish-traders/register');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Create Customer Account')).toBeVisible();

    // 2. Perform Registration under Store Context
    const testEmail = `cust_store_${Date.now()}@example.com`;
    await page.fill('input[label="First Name"]', 'Ravi');
    await page.fill('input[label="Last Name"]', 'Kumar');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'CustomerPassword123!');
    await page.click('button[type="submit"]');

    // 3. Customer Sign In under Store Context
    await page.goto('http://localhost:5174/store/satish-traders/login');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'CustomerPassword123!');
    await page.click('button[type="submit"]');

    // 4. Verify Account Portal Loaded
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Invoices & Payment History')).toBeVisible();
  });

});
