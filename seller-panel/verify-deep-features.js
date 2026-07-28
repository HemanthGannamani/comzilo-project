import { chromium } from '@playwright/test';

async function runDeepFeatureManualAudit() {
  console.log('--- Launching Deep Feature Manual Interactive Audit ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[Console Error] ${msg.text()}`);
      errors.push(`Console Error: ${msg.text()}`);
    }
  });

  page.on('response', res => {
    if (res.status() >= 400 && !res.url().includes('favicon')) {
      console.log(`[HTTP ${res.status()}] ${res.url()}`);
      errors.push(`HTTP ${res.status()}: ${res.url()}`);
    }
  });

  // 1. Admin Panel Deep Audit
  console.log('\n--- 1. Admin Panel Deep Feature Audit ---');
  await page.goto('http://localhost:4200/login');
  await page.waitForLoadState('domcontentloaded');

  const adminEmail = page.locator('form input').first();
  if (await adminEmail.isVisible()) {
    await adminEmail.fill('admin@comzilo.com');
    await page.locator('form input[type="password"]').first().fill('SuperAdminSecurePassword2026!');
    await page.locator('form button[type="submit"]').first().click();
    await page.waitForTimeout(1500);
  }

  // Click buttons and open modals on Admin pages
  await page.goto('http://localhost:4200/tenants');
  await page.waitForLoadState('domcontentloaded');
  const addTenantBtn = page.locator('button:has-text("Add"), button:has-text("Create"), button:has-text("New")').first();
  if (await addTenantBtn.isVisible().catch(() => false)) {
    await addTenantBtn.click().catch(() => {});
    await page.waitForTimeout(500);
  }

  await page.goto('http://localhost:4200/sellers');
  await page.waitForLoadState('domcontentloaded');

  await page.goto('http://localhost:4200/stores');
  await page.waitForLoadState('domcontentloaded');

  await page.goto('http://localhost:4200/subscriptions');
  await page.waitForLoadState('domcontentloaded');

  // 2. Seller Panel Deep Audit
  console.log('\n--- 2. Seller Panel Deep Feature Audit ---');
  await page.goto('http://localhost:5173/login');
  await page.waitForLoadState('domcontentloaded');

  const sellerEmail = page.locator('form input').first();
  if (await sellerEmail.isVisible()) {
    await sellerEmail.fill('admin@comzilo.com');
    await page.locator('form input[type="password"]').first().fill('SuperAdminSecurePassword2026!');
    await page.locator('form button[type="submit"]').first().click();
    await page.waitForTimeout(1500);
  }

  const sellerPages = [
    '/products',
    '/categories',
    '/tags',
    '/orders',
    '/customers',
    '/invoices',
    '/payments',
    '/inventory/dashboard',
    '/inventory/warehouses',
    '/inventory/balances',
    '/inventory/stock-management',
    '/inventory/transfers',
    '/inventory/adjustments',
    '/inventory/suppliers',
    '/inventory/purchase-orders',
    '/inventory/grn',
    '/marketing/dashboard',
    '/marketing/email-providers',
    '/marketing/email-templates',
    '/marketing/campaigns',
    '/marketing/whatsapp',
    '/marketing/coupons',
    '/marketing/email-logs',
    '/finance/payments',
    '/finance/refunds',
    '/reports',
    '/settings',
  ];

  for (const sp of sellerPages) {
    await page.goto(`http://localhost:5173${sp}`);
    await page.waitForLoadState('domcontentloaded');
    console.log(`Audited Seller route: ${sp}`);
  }

  // 3. Customer Panel Deep Audit
  console.log('\n--- 3. Customer Panel Deep Feature Audit ---');
  const customerPages = ['/', '/products', '/cart', '/checkout', '/orders', '/account'];
  for (const cp of customerPages) {
    await page.goto(`http://localhost:3000${cp}`);
    await page.waitForLoadState('domcontentloaded');
    console.log(`Audited Customer route: ${cp}`);
  }

  await browser.close();
  console.log(`\nDeep Feature Audit Complete. Total Errors Detected: ${errors.length}`);
}

runDeepFeatureManualAudit().catch(err => {
  console.error('Deep Feature Audit Error:', err);
  process.exit(1);
});
