import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/login');
  await page.fill('input[name="email"]', 'admin@comzilo.com');
  await page.fill('input[name="password"]', 'SuperAdminSecurePassword2026!');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/dashboard', { timeout: 15000 }).catch(() => {});
  
  await page.context().storageState({ path: 'tests/auth.json' });
  await browser.close();
}

export default globalSetup;
