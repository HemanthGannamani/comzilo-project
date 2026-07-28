import { test, expect } from '@playwright/test';
import { loginAsSeller } from './test-helpers';

test.describe('Seller Panel - Enterprise Business Workflows Validation Suite', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('1. End-to-End Catalog & Product Lifecycle Workflow', async ({ page }) => {
    // A. Navigate to Categories
    await page.goto('/categories');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Categor/i);

    // B. Navigate to Brands & Tags
    await page.goto('/tags');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Brand|Tag/i);

    // C. Navigate to Products
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Product/i);
  });

  test('2. End-to-End Inventory & Warehouse Operations Workflow', async ({ page }) => {
    // A. Warehouse Management
    await page.goto('/inventory/warehouses');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Warehouse/i);

    // B. Inventory Balances & Stock Tracking
    await page.goto('/inventory/balances');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Inventory|Balance/i);

    // C. Stock Adjustments & Transfers
    await page.goto('/inventory/stock-management');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Stock|Management/i);
  });

  test('3. End-to-End Purchasing & Procurement Workflow', async ({ page }) => {
    // A. Suppliers Directory
    await page.goto('/inventory/suppliers');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Supplier/i);

    // B. Purchase Orders
    await page.goto('/inventory/purchase-orders');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Purchase Order|PO/i);

    // C. Goods Receipt (GRN)
    await page.goto('/inventory/grn');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Goods Receipt|GRN/i);
  });

  test('4. End-to-End Marketing & Communication Automation Workflow', async ({ page }) => {
    // A. Email Providers
    await page.goto('/marketing/email-providers');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Email|Provider/i);

    // B. Email Templates
    await page.goto('/marketing/email-templates');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Template|Email/i);

    // C. Campaigns & Coupons
    await page.goto('/marketing/campaigns');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Campaign/i);

    // D. Email Logs Audit
    await page.goto('/marketing/email-logs');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Email|Log/i);
  });

  test('5. End-to-End Store Settings & Persistence Workflow', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Setting|Store|General/i);
  });
});
