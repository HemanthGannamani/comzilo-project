import { test, expect } from '@playwright/test';

test.describe('Admin Subscription Plans Management & Error Handling E2E Suite', () => {
  test('Subscription Plans List, Creation, Modification, & Fallback States', async ({ request }) => {
    console.log('[Playwright E2E] Testing Admin Subscription Plans Microservice...');

    // 1. Verify GET /api/v1/subscription-plans Endpoint
    const listRes = await request.get('http://127.0.0.1:5000/api/v1/subscription-plans');
    expect(listRes.status()).toBe(200);
    const listData = await listRes.json();
    console.log('[Playwright E2E] Subscription Plans Count:', listData.data.length);
    expect(listData.data).toBeDefined();

    // 2. Create New Subscription Tier via API
    const testPlanCode = `plan_e2e_${Date.now()}`;
    const createRes = await request.post('http://127.0.0.1:5000/api/v1/subscription-plans', {
      data: {
        code: testPlanCode,
        name: `E2E Custom Tier ${Date.now()}`,
        description: 'Automated Playwright E2E Subscription Test Tier',
        priceMonthly: 199.99,
        priceYearly: 1999.99,
        storeLimit: 5,
        userLimit: 25,
        warehouseLimit: 3,
        trialDays: 14,
        isActive: true,
        features: ['Automated Inventory Sync', '24/7 Dedicated Manager', 'Custom Domain SSL'],
      },
    });
    expect(createRes.status()).toBe(201);
    const createdPlan = (await createRes.json()).data;
    console.log('[Playwright E2E] Created Plan Tier:', createdPlan.name, 'ID:', createdPlan.id);
    expect(createdPlan.id).toBeDefined();

    // 3. Update Subscription Tier
    const updateRes = await request.put(`http://127.0.0.1:5000/api/v1/subscription-plans/${createdPlan.id}`, {
      data: {
        priceMonthly: 249.99,
        description: 'Updated E2E Subscription Plan Description',
      },
    });
    expect(updateRes.status()).toBe(200);
    const updatedPlan = (await updateRes.json()).data;
    expect(Number(updatedPlan.priceMonthly)).toBe(249.99);
    console.log('[Playwright E2E] Updated Plan Tier Price to:', updatedPlan.priceMonthly);

    // 4. Delete Subscription Tier
    const deleteRes = await request.delete(`http://127.0.0.1:5000/api/v1/subscription-plans/${createdPlan.id}`);
    expect(deleteRes.status()).toBe(200);
    console.log('[Playwright E2E] Cleanly Deleted Plan Tier ID:', createdPlan.id);
  });
});
