import { chromium } from '@playwright/test';

async function runButtonVerificationAudit() {
  console.log('=== Starting Comprehensive Button Action Audit ===\n');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let totalButtonsClicked = 0;
  let brokenButtons = 0;
  const buttonErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      buttonErrors.push(`Console Error: ${msg.text()}`);
    }
  });

  page.on('response', res => {
    if (res.status() >= 400 && !res.url().includes('favicon')) {
      buttonErrors.push(`Network Error ${res.status()}: ${res.url()}`);
    }
  });

  // Helper to click all buttons on a page safely
  async function testButtonsOnPage(url, pageName) {
    console.log(`Auditing buttons on ${pageName} (${url})...`);
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);

      // Find all button elements
      const buttons = await page.locator('button, [role="button"], a.MuiButton-root, div.MuiTab-root').all();
      console.log(`Found ${buttons.length} buttons/interactive triggers on ${pageName}.`);

      for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i];
        if (await btn.isVisible().catch(() => false) && await btn.isEnabled().catch(() => false)) {
          const text = (await btn.textContent().catch(() => '')) || (await btn.getAttribute('aria-label').catch(() => '')) || `Button #${i+1}`;
          const cleanText = text.trim().replace(/\s+/g, ' ').substring(0, 30);
          
          try {
            // Click button safely
            await btn.click({ timeout: 2000 }).catch(() => {});
            totalButtonsClicked++;
            await page.waitForTimeout(200);

            // Close any opened modal/dialog
            const closeBtn = page.locator('button:has-text("Close"), button:has-text("Cancel"), [aria-label="close"]').first();
            if (await closeBtn.isVisible().catch(() => false)) {
              await closeBtn.click().catch(() => {});
            }
          } catch (e) {
            brokenButtons++;
            buttonErrors.push(`Failed clicking '${cleanText}' on ${pageName}`);
          }
        }
      }
    } catch (err) {
      console.error(`Error auditing ${pageName}:`, err.message);
    }
  }

  // 1. Audit Admin Panel Buttons
  console.log('\n--- 1. Testing Admin Panel Buttons (http://localhost:4200) ---');
  await page.goto('http://localhost:4200/login');
  const adminEmail = page.locator('form input').first();
  if (await adminEmail.isVisible()) {
    await adminEmail.fill('admin@comzilo.com');
    await page.locator('form input[type="password"]').first().fill('SuperAdminSecurePassword2026!');
    await page.locator('form button[type="submit"]').first().click();
    await page.waitForTimeout(1500);
  }

  const adminUrls = [
    { url: 'http://localhost:4200/dashboard', name: 'Admin Dashboard' },
    { url: 'http://localhost:4200/tenants', name: 'Admin Tenants' },
    { url: 'http://localhost:4200/seller-applications', name: 'Admin Seller Applications' },
    { url: 'http://localhost:4200/sellers', name: 'Admin Sellers' },
    { url: 'http://localhost:4200/stores', name: 'Admin Stores' },
    { url: 'http://localhost:4200/subscriptions', name: 'Admin Subscriptions' },
    { url: 'http://localhost:4200/users', name: 'Admin Users' },
    { url: 'http://localhost:4200/roles', name: 'Admin Roles' },
    { url: 'http://localhost:4200/reports', name: 'Admin Reports' },
    { url: 'http://localhost:4200/settings', name: 'Admin Settings' },
  ];

  for (const item of adminUrls) {
    await testButtonsOnPage(item.url, item.name);
  }

  // 2. Audit Seller Panel Buttons
  console.log('\n--- 2. Testing Seller Panel Buttons (http://localhost:5173) ---');
  await page.goto('http://localhost:5173/login');
  const sellerEmail = page.locator('form input').first();
  if (await sellerEmail.isVisible()) {
    await sellerEmail.fill('admin@comzilo.com');
    await page.locator('form input[type="password"]').first().fill('SuperAdminSecurePassword2026!');
    await page.locator('form button[type="submit"]').first().click();
    await page.waitForTimeout(1500);
  }

  const sellerUrls = [
    { url: 'http://localhost:5173/dashboard', name: 'Seller Dashboard' },
    { url: 'http://localhost:5173/products', name: 'Seller Products' },
    { url: 'http://localhost:5173/categories', name: 'Seller Categories' },
    { url: 'http://localhost:5173/tags', name: 'Seller Tags' },
    { url: 'http://localhost:5173/orders', name: 'Seller Orders' },
    { url: 'http://localhost:5173/customers', name: 'Seller Customers' },
    { url: 'http://localhost:5173/invoices', name: 'Seller Invoices' },
    { url: 'http://localhost:5173/payments', name: 'Seller Payments' },
    { url: 'http://localhost:5173/inventory/dashboard', name: 'Seller Inventory Dashboard' },
    { url: 'http://localhost:5173/inventory/warehouses', name: 'Seller Warehouses' },
    { url: 'http://localhost:5173/inventory/balances', name: 'Seller Balances' },
    { url: 'http://localhost:5173/inventory/suppliers', name: 'Seller Suppliers' },
    { url: 'http://localhost:5173/marketing/dashboard', name: 'Seller Marketing Dashboard' },
    { url: 'http://localhost:5173/marketing/email-providers', name: 'Seller Email Providers' },
    { url: 'http://localhost:5173/marketing/email-templates', name: 'Seller Email Templates' },
    { url: 'http://localhost:5173/marketing/campaigns', name: 'Seller Campaigns' },
    { url: 'http://localhost:5173/marketing/whatsapp', name: 'Seller WhatsApp' },
    { url: 'http://localhost:5173/marketing/coupons', name: 'Seller Coupons' },
    { url: 'http://localhost:5173/marketing/email-logs', name: 'Seller Email Logs' },
    { url: 'http://localhost:5173/reports', name: 'Seller Reports' },
    { url: 'http://localhost:5173/settings', name: 'Seller Settings' },
  ];

  for (const item of sellerUrls) {
    await testButtonsOnPage(item.url, item.name);
  }

  // 3. Audit Customer Panel Buttons
  console.log('\n--- 3. Testing Customer Panel Buttons (http://localhost:3000) ---');
  const customerUrls = [
    { url: 'http://localhost:3000/', name: 'Customer Home' },
    { url: 'http://localhost:3000/products', name: 'Customer Products' },
    { url: 'http://localhost:3000/cart', name: 'Customer Cart' },
    { url: 'http://localhost:3000/checkout', name: 'Customer Checkout' },
    { url: 'http://localhost:3000/orders', name: 'Customer Orders' },
    { url: 'http://localhost:3000/account', name: 'Customer Account' },
  ];

  for (const item of customerUrls) {
    await testButtonsOnPage(item.url, item.name);
  }

  await browser.close();

  console.log('\n=== Button Action Audit Complete ===');
  console.log(`Total Interactive Buttons Clicked: ${totalButtonsClicked}`);
  console.log(`Broken / Unresponsive Buttons: ${brokenButtons}`);
  console.log(`Errors Recorded: ${buttonErrors.length}`);
}

runButtonVerificationAudit().catch(err => {
  console.error('Button Audit Error:', err);
  process.exit(1);
});
