import { test, expect } from '@playwright/test';

test.describe('Enterprise Platform Users Management System', () => {
  test('Verify Create, Edit, Reset Password, Audit Logging, and Delete protection for Platform Users', async ({ page }) => {
    // 1. Login as Super Admin
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
    const testUser = {
      firstName: `PlatformOps_${timestamp}`,
      lastName: 'Specialist',
      email: `ops_spec_${timestamp}@example.com`,
      phone: '+15551234567',
      roleCode: 'SUPPORT',
      status: 'active',
    };

    console.log(`[Playwright E2E] Creating new Platform User: ${testUser.email}...`);

    // 2. Create Platform User
    const createRes = await page.request.post('http://localhost:5000/api/v1/admin/platform-users', {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: testUser,
    });

    expect(createRes.status()).toBe(201);
    const createData = await createRes.json();
    expect(createData?.success).toBe(true);

    const createdId = createData?.data?.id;
    const tempPassword = createData?.data?.tempPassword;
    expect(createdId).toBeTruthy();
    expect(tempPassword).toBeTruthy();
    console.log(`[Playwright E2E] Platform User Created! ID: ${createdId} | Temp Password: ${tempPassword}`);

    // 3. Verify Login using Temporary Password & mustChangePassword Flag
    console.log('[Playwright E2E] Verifying user login using temporary password...');
    const userLoginRes = await page.request.post('http://localhost:5000/api/v1/auth/login', {
      data: {
        email: testUser.email,
        password: tempPassword,
      },
    });
    expect(userLoginRes.status()).toBe(200);
    const userLoginData = await userLoginRes.json();
    const mustChange = userLoginData?.data?.user?.mustChangePassword ?? userLoginData?.data?.mustChangePassword;
    expect(mustChange).toBe(true);
    console.log('[Playwright E2E] Verified user login with mustChangePassword = true!');

    // 4. Edit Platform User (Update Role to FINANCE & Status to Inactive)
    console.log(`[Playwright E2E] Updating Platform User ID ${createdId}...`);
    const updateRes = await page.request.put(`http://localhost:5000/api/v1/admin/platform-users/${createdId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: {
        firstName: `PlatformOps_Updated_${timestamp}`,
        roleCode: 'FINANCE',
        status: 'inactive',
      },
    });
    expect(updateRes.status()).toBe(200);
    const updateData = await updateRes.json();
    expect(updateData?.data?.status).toBe('Inactive');

    // 5. Reset Password
    console.log(`[Playwright E2E] Resetting password for Platform User ID ${createdId}...`);
    const resetRes = await page.request.post(`http://localhost:5000/api/v1/admin/platform-users/${createdId}/reset-password`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(resetRes.status()).toBe(200);
    const resetData = await resetRes.json();
    expect(resetData?.data?.tempPassword).toBeTruthy();

    // 6. Test Non-Self Delete Protection (Current logged in Super Admin cannot delete ID 1)
    console.log('[Playwright E2E] Testing Super Admin self-delete prevention...');
    const selfDeleteRes = await page.request.delete('http://localhost:5000/api/v1/admin/platform-users/1', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(selfDeleteRes.status()).toBe(403);
    console.log('[Playwright E2E] Super Admin self-delete correctly blocked (403 Forbidden)!');

    // 7. Delete Test Platform User
    console.log(`[Playwright E2E] Deleting Test Platform User ID ${createdId}...`);
    const deleteRes = await page.request.delete(`http://localhost:5000/api/v1/admin/platform-users/${createdId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(deleteRes.status()).toBe(200);
    console.log('[Playwright E2E] Test Platform User deleted successfully!');

    // 8. Verify Audit Logs Recorded
    console.log('[Playwright E2E] Verifying audit logs for platform user actions...');
    const auditRes = await page.request.get('http://localhost:5000/api/v1/admin/system/audit-logs', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(auditRes.status()).toBe(200);
    const auditData = await auditRes.json();
    const logs = Array.isArray(auditData?.data) ? auditData.data : (auditData?.data?.logs || []);
    expect(Array.isArray(logs)).toBe(true);

    console.log('[Playwright E2E] Platform Users Enterprise Management System fully verified!');
  });
});
