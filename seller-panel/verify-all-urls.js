import { chromium } from '@playwright/test';

async function runManualInteractiveAudit() {
  console.log('Starting Interactive Multi-Portal Manual QA Audit...');
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

  page.on('response', response => {
    if (response.status() >= 400 && !response.url().includes('favicon')) {
      console.log(`[Network Error ${response.status()}] ${response.url()}`);
      errors.push(`Network Error ${response.status()}: ${response.url()}`);
    }
  });

  // 1. Audit Admin Panel
  console.log('\n--- 1. Auditing Admin Panel (http://localhost:4200) ---');
  await page.goto('http://localhost:4200/login');
  await page.waitForLoadState('domcontentloaded');
  console.log('Admin Login page loaded successfully.');

  const adminEmail = page.locator('form input').first();
  if (await adminEmail.isVisible()) {
    await adminEmail.fill('admin@comzilo.com');
    await page.locator('form input[type="password"]').first().fill('SuperAdminSecurePassword2026!');
    await page.locator('form button[type="submit"]').first().click();
    await page.waitForTimeout(1500);
  }

  const adminRoutes = ['/dashboard', '/tenants', '/seller-applications', '/sellers', '/stores', '/subscriptions', '/users', '/roles', '/reports', '/settings'];
  for (const r of adminRoutes) {
    await page.goto(`http://localhost:4200${r}`);
    await page.waitForLoadState('domcontentloaded');
    console.log(`Admin route ${r} loaded.`);
  }

  // 2. Audit Seller Panel
  console.log('\n--- 2. Auditing Seller Panel (http://localhost:5173) ---');
  await page.goto('http://localhost:5173/login');
  await page.waitForLoadState('domcontentloaded');
  console.log('Seller Login page loaded successfully.');

  const sellerEmail = page.locator('form input').first();
  if (await sellerEmail.isVisible()) {
    await sellerEmail.fill('admin@comzilo.com');
    await page.locator('form input[type="password"]').first().fill('SuperAdminSecurePassword2026!');
    await page.locator('form button[type="submit"]').first().click();
    await page.waitForTimeout(1500);
  }

  const sellerRoutes = ['/dashboard', '/products', '/categories', '/tags', '/orders', '/customers', '/invoices', '/payments', '/inventory/balances', '/marketing/email-logs', '/reports', '/settings'];
  for (const r of sellerRoutes) {
    await page.goto(`http://localhost:5173${r}`);
    await page.waitForLoadState('domcontentloaded');
    console.log(`Seller route ${r} loaded.`);
  }

  // 3. Audit Customer Panel
  console.log('\n--- 3. Auditing Customer Panel (http://localhost:3000) ---');
  const customerRoutes = ['/', '/products', '/cart', '/checkout', '/orders', '/account'];
  for (const r of customerRoutes) {
    await page.goto(`http://localhost:3000${r}`);
    await page.waitForLoadState('domcontentloaded');
    console.log(`Customer route ${r} loaded.`);
  }

  await browser.close();
  console.log('\n--- Interactive Manual QA Audit Finished ---');
  console.log(`Total Errors Detected: ${errors.length}`);
}

runManualInteractiveAudit().catch(err => {
  console.error('Audit Script Error:', err);
  process.exit(1);
});
