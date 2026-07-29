import { test, expect } from '@playwright/test';

test.describe('Seller Wallet & Escrow Settlement System E2E Workflow', () => {
  test('Complete Seller Wallet Workflow: Balances, Escrow Protection, Transactions & Withdrawal Request', async ({ page }) => {
    console.log('[Playwright E2E] Navigating to Seller Login...');
    await page.goto('http://localhost:5173/login');

    // 1. Seller Login
    await page.fill('input[type="email"]', 'bordmart0@gmail.com');
    await page.fill('input[type="password"]', 'Sel831Pass!570');
    await page.click('button:has-text("Sign In")');

    // Handle optional password change if prompted
    if (page.url().includes('/change-password')) {
      await page.fill('input[name="currentPassword"], input[placeholder*="Current"]', 'Sel831Pass!570');
      await page.fill('input[name="newPassword"], input[placeholder*="New"]', 'Sel831Pass!570');
      await page.fill('input[name="confirmPassword"], input[placeholder*="Confirm"]', 'Sel831Pass!570');
      await page.click('button:has-text("Update Password")');
    }

    await page.waitForURL('**/dashboard', { timeout: 10000 });
    console.log('[Playwright E2E] Seller successfully logged in!');

    // 2. Navigate to Seller Wallet Hub
    await page.goto('http://localhost:5173/finance/wallet');
    await page.waitForSelector('text=Seller Wallet & Settlement Hub', { timeout: 10000 });
    console.log('[Playwright E2E] Seller Wallet page loaded!');

    // 3. Verify Balances & Stat Cards
    const totalCard = await page.isVisible('text=TOTAL WALLET BALANCE');
    const pendingCard = await page.isVisible('text=PENDING BALANCE (ESCROW)');
    const availableCard = await page.isVisible('text=AVAILABLE FOR WITHDRAWAL');
    const withdrawnCard = await page.isVisible('text=TOTAL WITHDRAWN');

    expect(totalCard).toBe(true);
    expect(pendingCard).toBe(true);
    expect(availableCard).toBe(true);
    expect(withdrawnCard).toBe(true);
    console.log('[Playwright E2E] Verified 4 Balance Stat Cards!');

    // 4. Verify Escrow Protection Alert Notice
    const escrowAlert = await page.isVisible('text=Comzilo Platform Escrow Protection Active');
    expect(escrowAlert).toBe(true);

    // 5. Open Withdraw Funds Modal
    await page.click('button:has-text("Withdraw Funds")');
    await page.waitForSelector('text=Withdraw Funds to Bank Account', { timeout: 5000 });

    // Fill Amount
    await page.fill('input[type="number"]', '50');
    await page.click('button:has-text("Confirm Withdrawal")');
    console.log('[Playwright E2E] Submitted Withdrawal Request of INR 50!');

    // 6. Verify Withdrawal Request Logged in Table
    await page.waitForTimeout(2000);
    const withdrawalsTab = page.locator('button:has-text("Withdrawal Requests")');
    await withdrawalsTab.click();

    const requestRow = await page.isVisible('text=INR 50.00');
    expect(requestRow).toBe(true);
    console.log('[Playwright E2E] Verified Withdrawal Request in table!');
  });
});
