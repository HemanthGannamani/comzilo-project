import { test, expect } from '@playwright/test';

test.describe('Seller Financial & Earnings Dashboard E2E Workflow', () => {
  test('Tenant-Scoped Metrics Aggregation, Reports, & CSV Export', async ({ request }) => {
    console.log('[Playwright E2E] Testing Seller Financial Dashboard...');

    // 1. Fetch Seller Financial Overview Metrics
    const overviewRes = await request.get('http://127.0.0.1:5000/api/v1/seller/wallet/financial-dashboard', {
      headers: { 'x-tenant-id': '47' },
    });
    expect(overviewRes.status()).toBe(200);
    const overviewData = await overviewRes.json();
    console.log('[Playwright E2E] Seller Financial Data:', overviewData.data);

    const metrics = overviewData.data;
    expect(metrics.todayRevenue).toBeDefined();
    expect(metrics.monthlyRevenue).toBeDefined();
    expect(metrics.totalBalance).toBeDefined();
    expect(metrics.pendingBalance).toBeDefined();
    expect(metrics.availableBalance).toBeDefined();
    expect(metrics.settlementHistory).toBeDefined();
    expect(metrics.withdrawalHistory).toBeDefined();
    expect(metrics.invoices).toBeDefined();
    expect(metrics.commissionReports).toBeDefined();
    expect(metrics.revenueChart).toBeDefined();

    // 2. Test Seller Financial CSV Export Endpoint
    const csvRes = await request.get('http://127.0.0.1:5000/api/v1/seller/wallet/financial-export?format=csv', {
      headers: { 'x-tenant-id': '47' },
    });
    expect(csvRes.status()).toBe(200);
    const csvText = await csvRes.text();
    expect(csvText).toContain('Today Revenue');
    expect(csvText).toContain('Monthly Revenue');
    expect(csvText).toContain('Total Wallet Balance');
    console.log('[Playwright E2E] Seller Financial CSV Export Verified Cleanly!');
  });
});
