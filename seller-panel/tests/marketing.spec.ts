import { test, expect } from '@playwright/test';

test.describe('Phase 5 - Marketing & Customer Engagement Module E2E Suite', () => {

  test('Complete End-to-End QA Verification of All 10 Marketing Modules', async ({ page }) => {
    // Step 0: Real User Authentication
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="email"]', 'admin@comzilo.com');
    await page.fill('input[name="password"]', 'SuperAdminSecurePassword2026!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // 1. Marketing Dashboard
    await page.goto('http://localhost:5173/marketing/dashboard');
    await page.waitForTimeout(1500);
    await expect(page.locator('h5:has-text("Marketing")')).toBeVisible();
    await expect(page.locator('text=TOTAL CAMPAIGNS')).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/1_marketing_dashboard.png', fullPage: true });

    // 2. Email Providers
    await page.goto('http://localhost:5173/marketing/email-providers');
    await page.waitForTimeout(1500);
    await expect(page.locator('h6:has-text("Custom SMTP Server")')).toBeVisible();
    await expect(page.locator('h6:has-text("Amazon SES")')).toBeVisible();

    const configureBtn = page.locator('button:has-text("Configure Settings")').first();
    await configureBtn.click();
    await page.waitForSelector('.MuiDialog-root');

    await page.locator('.MuiDialog-root button:has-text("Test Connection")').click();
    await page.waitForTimeout(1000);

    await page.locator('.MuiDialog-root button:has-text("Save Settings")').click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/2_email_providers.png', fullPage: true });

    // 3. Email Templates
    await page.goto('http://localhost:5173/marketing/email-templates');
    await page.waitForTimeout(1500);
    await page.locator('button:has-text("Create Template")').click();
    await page.waitForSelector('.MuiDialog-root');
    await page.locator('.MuiDialog-root input').first().fill('Playwright Special Offer');
    await page.locator('.MuiDialog-root button:has-text("Save Template")').click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/3_email_templates.png', fullPage: true });

    // 4. Campaigns
    await page.goto('http://localhost:5173/marketing/campaigns');
    await page.waitForTimeout(1500);
    await page.locator('button:has-text("New Campaign")').click();
    await page.waitForSelector('.MuiDialog-root');
    await page.locator('.MuiDialog-root input').first().fill('Playwright Summer Blast');
    await page.locator('.MuiDialog-root button:has-text("Save Campaign")').click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/4_marketing_campaigns.png', fullPage: true });

    // 5. WhatsApp Marketing
    await page.goto('http://localhost:5173/marketing/whatsapp');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'tests/screenshots/5_whatsapp_marketing.png', fullPage: true });

    // 6. Coupons
    await page.goto('http://localhost:5173/marketing/coupons');
    await page.waitForTimeout(1500);
    await page.locator('button:has-text("Add Coupon")').click();
    await page.waitForSelector('.MuiDialog-root');
    await page.locator('.MuiDialog-root input').first().fill('PW2026CODE');
    await page.locator('.MuiDialog-root button:has-text("Save Coupon")').click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/6_coupons.png', fullPage: true });

    // 7. Abandoned Carts
    await page.goto('http://localhost:5173/marketing/abandoned-carts');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'tests/screenshots/7_abandoned_carts.png', fullPage: true });

    // 8. Customer Segments
    await page.goto('http://localhost:5173/marketing/segments');
    await page.waitForTimeout(1500);
    await page.locator('button:has-text("Create Segment")').click();
    await page.waitForSelector('.MuiDialog-root');
    await page.locator('.MuiDialog-root input').first().fill('Playwright VIP Buyers');
    await page.locator('.MuiDialog-root button:has-text("Save Segment")').click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/8_customer_segments.png', fullPage: true });

    // 9. Automation Rules
    await page.goto('http://localhost:5173/marketing/automation-rules');
    await page.waitForTimeout(1500);
    await page.locator('button:has-text("Create Rule")').click();
    await page.waitForSelector('.MuiDialog-root');
    await page.locator('.MuiDialog-root input').first().fill('Playwright Welcome Rule');
    await page.locator('.MuiDialog-root button:has-text("Save Rule")').click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/9_automation_rules.png', fullPage: true });

    // 10. Marketing Analytics
    await page.goto('http://localhost:5173/marketing/analytics');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'tests/screenshots/10_marketing_analytics.png', fullPage: true });
  });

});
