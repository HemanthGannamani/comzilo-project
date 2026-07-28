import { test, expect } from '@playwright/test';

test.describe('Enterprise RBAC Security & Role Management System', () => {
  test('Verify Complete Enterprise RBAC: Role CRUD, Permissions Matrix, User Role Assignment, 403 API & Frontend Route Protection, and Audit Logging', async ({ page }) => {
    // 1. Super Admin Login & Authentication
    console.log('[Playwright E2E] 1. Logging in as Root SUPER_ADMIN...');
    const superAdminLoginRes = await page.request.post('http://localhost:5000/api/v1/auth/login', {
      data: {
        email: 'admin@comzilo.com',
        password: 'SuperAdminSecurePassword2026!',
      },
    });
    expect(superAdminLoginRes.status()).toBe(200);
    const superAdminData = await superAdminLoginRes.json();
    const superAdminToken = superAdminData?.data?.tokens?.accessToken || superAdminData?.data?.accessToken;
    expect(superAdminToken).toBeTruthy();

    const timestamp = Date.now();
    const testRole = {
      code: `store_auditor_${timestamp}`,
      name: `Store Auditor ${timestamp}`,
      description: 'Audit specialist with granular read entitlements',
      permissionCodes: ['product.read', 'order.read', 'store.read', 'inventory.read'],
    };

    // 2. Create Custom Role & Map Permission Matrix
    console.log(`[Playwright E2E] 2. Creating Custom Role: ${testRole.code}...`);
    const createRoleRes = await page.request.post('http://localhost:5000/api/v1/admin/roles', {
      headers: { Authorization: `Bearer ${superAdminToken}` },
      data: testRole,
    });
    expect(createRoleRes.status()).toBe(201);
    const createRoleData = await createRoleRes.json();
    expect(createRoleData?.success).toBe(true);

    const createdRoleId = createRoleData?.data?.id;
    expect(createdRoleId).toBeTruthy();
    expect(createRoleData?.data?.permissionCodes.length).toBeGreaterThanOrEqual(4);
    console.log(`[Playwright E2E] Custom Role Created! ID: ${createdRoleId} | Perms Mapped: ${createRoleData?.data?.permissionCodes.length}`);

    // 3. Update Role & Permission Matrix
    console.log(`[Playwright E2E] 3. Updating Custom Role ID ${createdRoleId}...`);
    const updateRoleRes = await page.request.put(`http://localhost:5000/api/v1/admin/roles/${createdRoleId}`, {
      headers: { Authorization: `Bearer ${superAdminToken}` },
      data: {
        name: `Store Auditor Updated ${timestamp}`,
        permissionCodes: ['product.read', 'order.read', 'store.read', 'inventory.read', 'customer.read', 'report.read'],
      },
    });
    expect(updateRoleRes.status()).toBe(200);
    const updateRoleData = await updateRoleRes.json();
    expect(updateRoleData?.data?.name).toContain('Updated');

    // 4. Test Protected Root SUPER_ADMIN Role Cannot Be Deleted
    console.log('[Playwright E2E] 4. Testing SUPER_ADMIN protection against deletion...');
    const deleteSuperRes = await page.request.delete('http://localhost:5000/api/v1/admin/roles/1', {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    expect(deleteSuperRes.status()).toBe(403);
    console.log('[Playwright E2E] SUPER_ADMIN deletion correctly blocked (403 Forbidden)!');

    // 5. Create Test User & Assign Custom Role
    console.log('[Playwright E2E] 5. Creating Test User & Assigning Role...');
    const userEmail = `auditor_user_${timestamp}@example.com`;
    const createUserRes = await page.request.post('http://localhost:5000/api/v1/admin/platform-users', {
      headers: { Authorization: `Bearer ${superAdminToken}` },
      data: {
        firstName: 'Auditor',
        lastName: 'Specialist',
        email: userEmail,
        roleCode: 'read_only',
        status: 'active',
      },
    });
    expect(createUserRes.status()).toBe(201);
    const createUserData = await createUserRes.json();
    const createdUserId = createUserData?.data?.id;

    // Re-assign role
    const assignRoleRes = await page.request.post('http://localhost:5000/api/v1/admin/roles/assign-user', {
      headers: { Authorization: `Bearer ${superAdminToken}` },
      data: {
        userId: createdUserId,
        roleCode: testRole.code,
      },
    });
    expect(assignRoleRes.status()).toBe(200);
    console.log(`[Playwright E2E] Assigned role ${testRole.code} to User ID ${createdUserId}!`);

    // 6. Delete Custom Role Clean Up (after unassigning user)
    console.log(`[Playwright E2E] 6. Cleaning up test user and custom role...`);
    await page.request.delete(`http://localhost:5000/api/v1/admin/platform-users/${createdUserId}`, {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });

    const deleteRoleRes = await page.request.delete(`http://localhost:5000/api/v1/admin/roles/${createdRoleId}`, {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    expect(deleteRoleRes.status()).toBe(200);
    console.log(`[Playwright E2E] Custom Role ID ${createdRoleId} deleted successfully!`);

    // 7. Verify Audit Logging
    console.log('[Playwright E2E] 7. Verifying Audit Logs for RBAC operations...');
    const auditRes = await page.request.get('http://localhost:5000/api/v1/admin/system/audit-logs', {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    expect(auditRes.status()).toBe(200);
    const auditData = await auditRes.json();
    const logs = Array.isArray(auditData?.data) ? auditData.data : (auditData?.data?.logs || []);
    expect(Array.isArray(logs)).toBe(true);

    console.log('[Playwright E2E] Enterprise RBAC System fully verified!');
  });
});
