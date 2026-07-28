import { test, expect } from '@playwright/test';

test.describe('Multi-Tenant Store Management & Seller Isolation', () => {
  test('Verify store creation, approval, and Super Admin Store Directory visibility', async ({ page }) => {
    // Wait for rate limit window to clear
    await page.waitForTimeout(5000);

    // 1. Login to get token
    const loginRes = await page.request.post('http://localhost:5000/api/v1/auth/login', {
      data: {
        email: 'admin@comzilo.com',
        password: 'SuperAdminSecurePassword2026!',
      },
    });

    const loginData = await loginRes.json();
    const adminToken = loginData?.data?.tokens?.accessToken || loginData?.data?.accessToken || loginData?.accessToken;

    if (!adminToken) {
      console.log('Login failed:', loginData);
    }
    expect(adminToken).toBeTruthy();

    const timestamp = Date.now();
    const testSeller = {
      name: `Playwright Seller ${timestamp}`,
      email: `pw_seller_${timestamp}@example.com`,
      storeName: `PW Store ${timestamp}`,
    };

    console.log(`[Playwright E2E] Submitting seller application for: ${testSeller.storeName}...`);

    // 2. Submit Seller Application via API
    const appRes = await page.request.post('http://localhost:5000/api/v1/public/seller-applications', {
      data: {
        businessName: testSeller.storeName,
        preferredStoreName: testSeller.storeName,
        ownerName: testSeller.name,
        email: testSeller.email,
        phone: `+9198${Math.floor(10000000 + Math.random() * 90000000)}`,
        businessType: 'Retail',
        gstNumber: `36AAACB${Math.floor(1000 + Math.random() * 9000)}1Z5`,
        panNumber: `AAACB${Math.floor(1000 + Math.random() * 9000)}Z`,
        addressLine1: 'Playwright Boulevard 101',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
        postalCode: '500001',
        password: 'SellerPass123!',
        confirmPassword: 'SellerPass123!',
      },
    });

    expect(appRes.status()).toBe(201);
    const appData = await appRes.json();
    const appNumber = appData?.data?.applicationNumber;
    expect(appNumber).toBeTruthy();
    console.log(`[Playwright E2E] Application submitted successfully: ${appNumber}`);

    // 3. Fetch App ID & Approve Application
    const appsRes = await page.request.get('http://localhost:5000/api/v1/admin/seller-applications', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(appsRes.status()).toBe(200);
    const appsData = await appsRes.json();
    const appList = appsData?.data?.applications || appsData?.data || [];
    const targetApp = appList.find((a: any) => a.applicationNumber === appNumber || a.email === testSeller.email);
    expect(targetApp).toBeTruthy();

    const approveRes = await page.request.patch(`http://localhost:5000/api/v1/admin/seller-applications/${targetApp.id}/approve`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(approveRes.status()).toBe(200);
    console.log(`[Playwright E2E] Application ID ${targetApp.id} approved by Super Admin!`);

    // 4. Verify GET /stores returns all stores including newly created store
    const storesRes = await page.request.get('http://localhost:5000/api/v1/stores', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(storesRes.status()).toBe(200);
    const storesData = await storesRes.json();
    const allStores = storesData?.data || [];
    expect(allStores.length).toBeGreaterThanOrEqual(40);

    const newlyCreatedStore = allStores.find((s: any) => s.name?.includes(testSeller.storeName));
    expect(newlyCreatedStore).toBeTruthy();
    console.log(`[Playwright E2E] Verified store "${newlyCreatedStore.name}" (ID ${newlyCreatedStore.id}) in Super Admin Store Directory (Total Stores: ${allStores.length})!`);
  });
});
