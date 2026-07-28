import { test, expect } from '@playwright/test';

test.describe('Super Admin Subscription Plans Management', () => {
  test('Verify GET, EDIT, and PERSIST of Subscription Plan Tier', async ({ page }) => {
    console.log('[Playwright E2E] Testing GET /api/v1/subscription-plans...');
    const getRes = await page.request.get('http://localhost:5000/api/v1/subscription-plans');
    expect(getRes.status()).toBe(200);

    const getData = await getRes.json();
    const plans = getData?.data || [];
    expect(plans.length).toBeGreaterThanOrEqual(3);

    const targetPlan = plans.find((p: any) => p.code === 'starter' || p.id === 2);
    expect(targetPlan).toBeTruthy();
    console.log(`[Playwright E2E] Target plan found: ${targetPlan.name} (ID ${targetPlan.id})`);

    const timestamp = Date.now().toString().slice(-4);
    const updatedName = `Starter Plan Pro ${timestamp}`;
    const updatedPrice = 79.99;

    console.log(`[Playwright E2E] Updating plan ID ${targetPlan.id} to name "${updatedName}" and price $${updatedPrice}...`);

    const putRes = await page.request.put(`http://localhost:5000/api/v1/subscription-plans/${targetPlan.id}`, {
      data: {
        name: updatedName,
        priceMonthly: updatedPrice,
        priceYearly: updatedPrice * 10,
        storeLimit: 3,
        userLimit: 15,
        warehouseLimit: 3,
        features: ['Basic Catalog', 'POS Terminal', 'Standard Email Support', 'E2E Playwright Verified'],
        trialDays: 14,
        isActive: true,
      },
    });

    expect(putRes.status()).toBe(200);
    const putData = await putRes.json();
    expect(putData?.success).toBe(true);
    expect(putData?.data?.name).toBe(updatedName);
    expect(Number(putData?.data?.priceMonthly)).toBe(updatedPrice);

    console.log('[Playwright E2E] Verifying updated plan persists on fresh GET request...');
    const verifyRes = await page.request.get('http://localhost:5000/api/v1/subscription-plans');
    expect(verifyRes.status()).toBe(200);
    const verifyData = await verifyRes.json();
    const verifiedPlan = verifyData?.data?.find((p: any) => p.id === targetPlan.id);

    expect(verifiedPlan).toBeTruthy();
    expect(verifiedPlan.name).toBe(updatedName);
    expect(Number(verifiedPlan.priceMonthly)).toBe(updatedPrice);

    console.log(`[Playwright E2E] Subscription plan update successfully verified! Updated Name: "${verifiedPlan.name}", Price: $${verifiedPlan.priceMonthly}`);
  });
});
