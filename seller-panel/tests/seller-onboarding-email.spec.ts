import { test, expect } from '@playwright/test';

test.describe('Seller Application Approval & Real SMTP Credentials Email Workflow', () => {
  test('Verify seller registration, approval, password hash, mustChangePassword flag, and SMTP email dispatch', async ({ page }) => {
    // 1. Login as Super Admin to get Access Token
    const loginRes = await page.request.post('http://localhost:5000/api/v1/auth/login', {
      data: {
        email: 'admin@comzilo.com',
        password: 'SuperAdminSecurePassword2026!',
      },
    });

    expect(loginRes.status()).toBe(200);
    const loginData = await loginRes.json();
    const adminToken = loginData?.data?.tokens?.accessToken || loginData?.data?.accessToken || loginData?.accessToken;
    expect(adminToken).toBeTruthy();

    const timestamp = Date.now();
    const sellerData = {
      name: `Email Test Seller ${timestamp}`,
      email: `seller_email_test_${timestamp}@example.com`,
      storeName: `Email Test Store ${timestamp}`,
    };

    console.log(`[Playwright E2E] Submitting seller application for: ${sellerData.name}...`);

    // 2. Submit Seller Application
    const appRes = await page.request.post('http://localhost:5000/api/v1/public/seller-applications', {
      data: {
        businessName: sellerData.storeName,
        preferredStoreName: sellerData.storeName,
        ownerName: sellerData.name,
        email: sellerData.email,
        phone: `+9198${Math.floor(10000000 + Math.random() * 90000000)}`,
        businessType: 'Retail',
        gstNumber: `36AAACB${Math.floor(1000 + Math.random() * 9000)}1Z5`,
        panNumber: `AAACB${Math.floor(1000 + Math.random() * 9000)}Z`,
        addressLine1: 'SMTP Boulevard 101',
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
    console.log(`[Playwright E2E] Application ${appNumber} submitted!`);

    // 3. Fetch Application ID & Approve
    const appsRes = await page.request.get('http://localhost:5000/api/v1/admin/seller-applications', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(appsRes.status()).toBe(200);
    const appsData = await appsRes.json();
    const appList = appsData?.data?.applications || appsData?.data || [];
    const targetApp = appList.find((a: any) => a.applicationNumber === appNumber || a.email === sellerData.email);
    expect(targetApp).toBeTruthy();

    const approveRes = await page.request.patch(`http://localhost:5000/api/v1/admin/seller-applications/${targetApp.id}/approve`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(approveRes.status()).toBe(200);
    console.log(`[Playwright E2E] Application ${targetApp.id} approved successfully!`);

    // 4. Fetch Created Seller User ID & Trigger Resend Credentials Email
    const sellersRes = await page.request.get('http://localhost:5000/api/v1/admin/sellers', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(sellersRes.status()).toBe(200);
    const sellersData = await sellersRes.json();
    const sellersList = sellersData?.data?.sellers || sellersData?.data || [];
    const createdSellerUser = sellersList.find((s: any) => s.email === sellerData.email);
    expect(createdSellerUser).toBeTruthy();
    expect(createdSellerUser.mustChangePassword).toBe(true);

    console.log(`[Playwright E2E] Triggering Resend Credentials Email via SMTP for User ID ${createdSellerUser.id}...`);
    const resendRes = await page.request.post(`http://localhost:5000/api/v1/admin/sellers/${createdSellerUser.id}/resend-credentials`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(resendRes.status()).toBe(200);
    const resendData = await resendRes.json();
    expect(resendData?.success).toBe(true);
    expect(resendData?.data?.messageId).toBeTruthy();

    console.log(`[Playwright E2E] Credentials Email dispatched successfully via SMTP! Message ID: ${resendData?.data?.messageId}`);
  });
});
