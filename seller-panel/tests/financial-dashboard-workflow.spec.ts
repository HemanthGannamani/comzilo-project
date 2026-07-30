import { test, expect } from '@playwright/test';

test.describe('Super Admin Financial Intelligence Dashboard E2E Workflow', () => {
  test('Complete Metrics Aggregation, Log Inspection, Export, & Date Filtering', async ({ request }) => {
    console.log('[Playwright E2E] Testing Super Admin Financial Dashboard...');

    // 1. Fetch Financial Overview Metrics
    const overviewRes = await request.get('http://127.0.0.1:5000/api/v1/admin/finance/dashboard');
    expect(overviewRes.status()).toBe(200);
    const overviewData = await overviewRes.json();
    console.log('[Playwright E2E] Financial Overview Data:', overviewData.data);

    const metrics = overviewData.data;
    expect(metrics.platformRevenue).toBeDefined();
    expect(metrics.subscriptionRevenue).toBeDefined();
    expect(metrics.marketplaceRevenue).toBeDefined();
    expect(metrics.pendingSettlements).toBeDefined();
    expect(metrics.completedSettlements).toBeDefined();
    expect(metrics.refunds).toBeDefined();
    expect(metrics.chargebacks).toBeDefined();
    expect(metrics.paymentMethodBreakdown).toBeDefined();
    expect(metrics.monthlyRevenueTrend).toBeDefined();

    // 2. Test Date Range Filter API
    const dateFilteredRes = await request.get('http://127.0.0.1:5000/api/v1/admin/finance/dashboard?startDate=2026-01-01&endDate=2026-12-31');
    expect(dateFilteredRes.status()).toBe(200);
    const filteredData = await dateFilteredRes.json();
    expect(filteredData.data).toBeDefined();
    console.log('[Playwright E2E] Date Filtered GMV:', filteredData.data.marketplaceRevenue);

    // 3. Test Audit Log Endpoints (Gateway Logs, Webhook Logs, Payout Logs)
    const gwLogsRes = await request.get('http://127.0.0.1:5000/api/v1/admin/finance/gateway-logs');
    expect(gwLogsRes.status()).toBe(200);
    const gwLogs = await gwLogsRes.json();
    console.log('[Playwright E2E] Gateway Logs Count:', gwLogs.data.length);

    const whLogsRes = await request.get('http://127.0.0.1:5000/api/v1/admin/finance/webhook-logs');
    expect(whLogsRes.status()).toBe(200);

    const poLogsRes = await request.get('http://127.0.0.1:5000/api/v1/admin/finance/payout-logs');
    expect(poLogsRes.status()).toBe(200);

    // 4. Test Export Endpoints (CSV & Excel)
    const csvExportRes = await request.get('http://127.0.0.1:5000/api/v1/admin/finance/export?format=csv');
    expect(csvExportRes.status()).toBe(200);
    const csvText = await csvExportRes.text();
    expect(csvText).toContain('Platform Revenue');
    expect(csvText).toContain('Marketplace GMV');
    console.log('[Playwright E2E] CSV Export Generated Successfully!');
  });
});
