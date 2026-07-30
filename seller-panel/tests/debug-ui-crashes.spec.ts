import { test, expect } from '@playwright/test';

test.describe('Debug UI Crashes E2E', () => {
  test('Audit Admin Panel & Seller Panel UI rendering and console logs', async ({ page }) => {
    const consoleLogs: string[] = [];
    const pageErrors: string[] = [];

    page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
    page.on('pageerror', err => pageErrors.push(`[PAGE ERROR] ${err.message}\n${err.stack}`));

    console.log('--- AUDITING ADMIN PANEL (http://localhost:4200) ---');
    await page.goto('http://localhost:4200', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForTimeout(2000);

    console.log('Admin Console Logs:', consoleLogs);
    console.log('Admin Page Errors:', pageErrors);

    consoleLogs.length = 0;
    pageErrors.length = 0;

    console.log('--- AUDITING SELLER PANEL (http://localhost:5173/dashboard) ---');
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForTimeout(2000);

    console.log('Seller Console Logs:', consoleLogs);
    console.log('Seller Page Errors:', pageErrors);
  });
});
