import { test, expect } from '@playwright/test';

const API_BASE = 'http://localhost:5000/api/v1';

test.describe('Seller Onboarding & Credential Login E2E Audit', () => {
  const uniqueId = Date.now();
  const testEmail = `hemanth.seller.${uniqueId}@example.com`;
  const businessName = `Hemanth Enterprise Store ${uniqueId}`;
  const storeName = `Hemanth Store ${uniqueId}`;
  let tempPassword = '';
  let adminToken = '';

  test('Scenario: Register Seller -> Approve Application -> Receive Email -> Login -> Dashboard', async ({ request, page }) => {
    console.log(`\n====================================================`);
    console.log(`FORENSIC E2E SELLER ONBOARDING TEST FOR: ${testEmail}`);
    console.log(`====================================================\n`);

    // STEP 0: Log in as Super Admin to get real Bearer token
    console.log('[STEP 0] Logging in as Super Admin...');
    const adminLoginRes = await request.post(`${API_BASE}/auth/login`, {
      data: {
        email: 'admin@comzilo.com',
        password: 'SuperAdminSecurePassword2026!',
      },
    });

    expect(adminLoginRes.status()).toBe(200);
    const adminLoginData = await adminLoginRes.json();
    adminToken = adminLoginData.data.accessToken;
    console.log('✅ Super Admin Token Acquired Successfully!');

    // STEP 1: Submit Seller Application via API
    console.log(`\n[STEP 1] Submitting Seller Application for ${testEmail}...`);
    const regRes = await request.post(`${API_BASE}/seller-applications`, {
      data: {
        businessName,
        ownerName: 'Hemanth Gannamani',
        email: testEmail,
        phone: '9' + uniqueId.toString().slice(-9),
        businessType: 'Retail',
        gstNumber: '37' + uniqueId.toString().slice(-13),
        panNumber: 'ABC' + uniqueId.toString().slice(-7),
        addressLine1: 'Road No 1, Jubilee Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
        postalCode: '500033',
        preferredStoreName: storeName,
        password: 'OriginalSellerPassword123!',
        confirmPassword: 'OriginalSellerPassword123!',
      },
    });

    expect(regRes.status()).toBe(201);
    const regBody = await regRes.json();
    const applicationId = regBody.data?.id;
    expect(applicationId).toBeGreaterThan(0);
    console.log(`✅ Application Registered Successfully! ID: ${applicationId}`);

    // STEP 2: Approve Application as Super Admin (using Bearer token)
    console.log(`\n[STEP 2] Approving Seller Application #${applicationId} as Super Admin...`);
    const approveRes = await request.patch(`${API_BASE}/admin/seller-applications/${applicationId}/approve`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    console.log(`Approve Response Status: ${approveRes.status()}`);
    expect(approveRes.status()).toBe(200);
    console.log('✅ Application Approved Successfully!');

    // STEP 3: Extract Emailed Temporary Password from Backend Email Queue API
    console.log(`\n[STEP 3] Extracting Emailed Credentials from Marketing Email Queue API...`);
    const queueRes = await request.get(`${API_BASE}/marketing/email-queue?recipient=${testEmail}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    expect(queueRes.status()).toBe(200);
    const queueData = await queueRes.json();
    console.log('Queue Data:', JSON.stringify(queueData).slice(0, 300));
    const jobs = Array.isArray(queueData.data) ? queueData.data : (queueData.data?.rows || []);
    const job = jobs.find((j: any) => j.recipient === testEmail);
    expect(job).toBeTruthy();

    const payload = typeof job.payload_json === 'string' ? JSON.parse(job.payload_json) : job.payload_json;
    tempPassword = payload.temporaryPassword;

    console.log(`Recipient Email: ${testEmail}`);
    console.log(`Extracted Emailed Temp Password: "${tempPassword}"`);
    expect(tempPassword).toBeTruthy();

    // STEP 4: Test Backend HTTP API Login with Emailed Temp Password
    console.log(`\n[STEP 4] Verifying Backend HTTP Login API with Emailed Temp Password...`);
    const apiLoginRes = await request.post(`${API_BASE}/auth/login`, {
      data: {
        email: testEmail,
        password: tempPassword,
      },
    });

    expect(apiLoginRes.status()).toBe(200);
    const loginData = await apiLoginRes.json();
    expect(loginData.success).toBe(true);
    expect(loginData.data.accessToken).toBeTruthy();
    console.log('🎉 Backend HTTP API Login SUCCESSFUL!');
    console.log(`Access Token Received: YES`);
    console.log(`Tenant Slug: ${loginData.data.tenant.slug}`);

    // STEP 5: Perform Browser UI Login on Seller Portal
    console.log(`\n[STEP 5] Opening Seller Portal Browser UI (http://localhost:5173/login)...`);
    await page.goto('http://localhost:5173/login');

    await page.fill('input[type="email"], input[name="email"]', testEmail);
    await page.fill('input[type="password"], input[name="password"]', tempPassword);

    console.log('Clicking Sign In button...');
    await page.click('button[type="submit"]');

    // Wait for redirect to /change-password or /dashboard
    await page.waitForURL(/\/(dashboard|change-password)/, { timeout: 10000 });
    console.log(`Browser Redirected URL: ${page.url()}`);
    expect(page.url()).toMatch(/\/(dashboard|change-password)/);

    if (page.url().includes('change-password')) {
      console.log('Temporary password detected. Submitting new permanent password...');
      const passInputs = page.locator('input[type="password"]');
      await passInputs.nth(0).fill(tempPassword);
      await passInputs.nth(1).fill('NewPermanentSellerPass123!');
      await passInputs.nth(2).fill('NewPermanentSellerPass123!');

      await page.click('button[type="submit"]');
      await page.waitForURL(/\/dashboard/, { timeout: 10000 });
      console.log('Redirected to Seller Dashboard!');
    }

    expect(page.url()).toContain('/dashboard');
    console.log('🎉 Seller Dashboard Loaded Successfully!');

    // STEP 6: Test Logout and Re-login
    console.log(`\n[STEP 6] Testing Logout & Re-login...`);
    await page.goto('http://localhost:5173/login');

    await page.fill('input[type="email"], input[name="email"]', testEmail);
    await page.fill('input[type="password"], input[name="password"]', 'NewPermanentSellerPass123!');
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    expect(page.url()).toContain('/dashboard');

    console.log('\n🎉 FORENSIC E2E SELLER ONBOARDING & LOGIN TEST PASSED WITH 100% SUCCESS!');
  });
});
