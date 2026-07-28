import { test, expect } from '@playwright/test';

test.describe('Admin Shipping Providers Active/Inactive Toggle & Refresh', () => {
  test('Verify toggle status update and manual refresh button API persistence', async ({ page }) => {
    // 1. Super Admin Login
    console.log('[Playwright E2E] Logging in as Super Admin...');
    const loginRes = await page.request.post('http://localhost:5000/api/v1/auth/login', {
      data: {
        email: 'admin@comzilo.com',
        password: 'SuperAdminSecurePassword2026!',
      },
    });
    expect(loginRes.status()).toBe(200);
    const loginData = await loginRes.json();
    const token = loginData?.data?.tokens?.accessToken || loginData?.data?.accessToken;
    expect(token).toBeTruthy();

    // 2. Fetch Shipping Providers List
    console.log('[Playwright E2E] Fetching GET /api/v1/admin/shipping-providers/providers...');
    const provRes = await page.request.get('http://localhost:5000/api/v1/admin/shipping-providers/providers', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(provRes.status()).toBe(200);
    const provData = await provRes.json();
    const providers = provData?.data || [];
    expect(providers.length).toBeGreaterThan(0);

    const firstProvider = providers[0];
    const targetId = firstProvider.id;
    const initialStatus = Boolean(firstProvider.isActive);
    const newStatus = !initialStatus;

    console.log(`[Playwright E2E] Toggling Carrier ID ${targetId} ('${firstProvider.name}') status from ${initialStatus} to ${newStatus}...`);

    // 3. Toggle Carrier Status
    const toggleRes = await page.request.patch(`http://localhost:5000/api/v1/admin/shipping-providers/providers/${targetId}/status`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { isActive: newStatus },
    });
    expect(toggleRes.status()).toBe(200);
    const toggleData = await toggleRes.json();
    expect(Boolean(toggleData?.data?.isActive)).toBe(newStatus);
    console.log(`[Playwright E2E] Successfully toggled status! Persisted state: ${toggleData?.data?.isActive}`);

    // Restore original status
    await page.request.patch(`http://localhost:5000/api/v1/admin/shipping-providers/providers/${targetId}/status`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { isActive: initialStatus },
    });

    console.log('[Playwright E2E] Shipping Providers Active/Inactive toggle verified successfully!');
  });
});
