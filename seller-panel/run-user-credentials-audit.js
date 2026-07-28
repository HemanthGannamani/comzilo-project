import { chromium } from '@playwright/test';

async function runUserCredentialsAudit() {
  console.log('=== Starting Real User Credentials Manual Audit ===\n');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const auditLog = [];

  // 1. Admin Panel Audit with Super Admin Credentials
  console.log('--- 1. Admin Panel Audit (http://localhost:4200) ---');
  await page.goto('http://localhost:4200/login');
  await page.waitForLoadState('domcontentloaded');
  
  const adminEmail = page.locator('form input').first();
  if (await adminEmail.isVisible()) {
    await adminEmail.fill('admin@comzilo.com');
    await page.locator('form input[type="password"]').first().fill('SuperAdminSecurePassword2026!');
    await page.locator('form button[type="submit"]').first().click();
    await page.waitForTimeout(2000);
    console.log(`Admin Login Status URL: ${page.url()}`);
    auditLog.push(`Admin Login URL: ${page.url()}`);
  }

  // 2. Seller Panel Audit with Seller Credentials (satishveeravalli2004@gmail.com / Satish@123)
  console.log('\n--- 2. Seller Panel Audit (http://localhost:5173) ---');
  await page.goto('http://localhost:5173/login');
  await page.waitForLoadState('domcontentloaded');

  const sellerEmail = page.locator('form input').first();
  if (await sellerEmail.isVisible()) {
    await sellerEmail.fill('satishveeravalli2004@gmail.com');
    await page.locator('form input[type="password"]').first().fill('Satish@123');
    await page.locator('form button[type="submit"]').first().click();
    await page.waitForTimeout(2000);
    console.log(`Seller Login Status URL: ${page.url()}`);
    auditLog.push(`Seller Login URL: ${page.url()}`);
  }

  // Audit Seller Features under seller session
  const sellerFeatures = [
    { name: 'Products Catalog', path: '/products' },
    { name: 'Categories Tree', path: '/categories' },
    { name: 'Brands & Tags', path: '/tags' },
    { name: 'Sales Orders', path: '/orders' },
    { name: 'Customer List', path: '/customers' },
    { name: 'Invoices', path: '/invoices' },
    { name: 'Payments', path: '/payments' },
    { name: 'Inventory Balances', path: '/inventory/balances' },
    { name: 'Warehouses', path: '/inventory/warehouses' },
    { name: 'Suppliers', path: '/inventory/suppliers' },
    { name: 'Purchase Orders', path: '/inventory/purchase-orders' },
    { name: 'Goods Receipt GRN', path: '/inventory/grn' },
    { name: 'Email Providers', path: '/marketing/email-providers' },
    { name: 'Email Templates', path: '/marketing/email-templates' },
    { name: 'Campaigns', path: '/marketing/campaigns' },
    { name: 'WhatsApp Marketing', path: '/marketing/whatsapp' },
    { name: 'Coupons & Discounts', path: '/marketing/coupons' },
    { name: 'Email Logs', path: '/marketing/email-logs' },
    { name: 'Standalone Reports', path: '/reports' },
    { name: '12-Tab Settings', path: '/settings' },
  ];

  for (const feat of sellerFeatures) {
    await page.goto(`http://localhost:5173${feat.path}`);
    await page.waitForLoadState('domcontentloaded');
    const bodyText = (await page.locator('body').textContent()) || '';
    const hasError = bodyText.includes('404') || bodyText.includes('Server Error') || bodyText.includes('500');
    console.log(`Feature [${feat.name}] (${feat.path}): ${hasError ? 'FAILED' : 'SUCCESS'}`);
    auditLog.push(`Feature [${feat.name}] (${feat.path}): ${hasError ? 'FAILED' : 'SUCCESS'}`);
  }

  // 3. Customer Panel Audit (http://localhost:3000)
  console.log('\n--- 3. Customer Panel Audit (http://localhost:3000) ---');
  await page.goto('http://localhost:3000/');
  await page.waitForLoadState('domcontentloaded');
  console.log(`Customer Home URL: ${page.url()}`);
  auditLog.push(`Customer Home URL: ${page.url()}`);

  await page.goto('http://localhost:3000/products');
  await page.waitForLoadState('domcontentloaded');
  console.log(`Customer Products URL: ${page.url()}`);

  await page.goto('http://localhost:3000/checkout');
  await page.waitForLoadState('domcontentloaded');
  console.log(`Customer Checkout URL: ${page.url()}`);

  await browser.close();

  console.log('\n=== User Credentials Manual Audit Complete ===');
  console.log(auditLog.join('\n'));
}

runUserCredentialsAudit().catch(err => {
  console.error('Credentials Audit Error:', err);
  process.exit(1);
});
