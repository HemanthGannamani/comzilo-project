import { test, expect } from '@playwright/test';

test.describe('Seller Bank Account Verification & Settlement Approval Workflow E2E Suite', () => {
  test('Complete Bank Submission, Admin Approval, Verification Status & Multi-Tenant Isolation', async ({ request }) => {
    console.log('[Playwright Bank Verification E2E] Initializing Seller Bank Verification Test...');

    const testTenantId = 47000 + Math.floor(Math.random() * 1000);
    const sellerAuthHeader = {
      'Authorization': `Bearer seller_token_tenant_${testTenantId}`,
      'X-Tenant-ID': String(testTenantId),
    };

    const adminAuthHeader = {
      'Authorization': 'Bearer super_admin_token',
      'X-Tenant-ID': '1',
    };

    // 1. Submit Bank Account Details for Test Tenant
    const submitRes = await request.post('http://127.0.0.1:5000/api/v1/seller/bank-account/submit', {
      headers: sellerAuthHeader,
      data: {
        accountHolderName: `Comzilo Merchant ${testTenantId} LLC`,
        bankName: 'HDFC Bank',
        accountNumber: `50100${testTenantId}`,
        confirmAccountNumber: `50100${testTenantId}`,
        ifscCode: 'HDFC0001234',
        upiId: `merchant${testTenantId}@okhdfcbank`,
        panNumber: 'ABCDE1234F',
        gstNumber: '27ABCDE1234F1Z5',
        cancelledChequeUrl: 'https://comzilo.com/docs/cancelled-cheque-verified.pdf',
        forceSubmit: true,
      },
    });
    expect(submitRes.status()).toBe(200);
    const submittedAccount = (await submitRes.json()).data;
    console.log('[Playwright Bank Verification E2E] Submitted Bank Account ID:', submittedAccount.id, 'Status:', submittedAccount.status);
    expect(submittedAccount.status).toBe('PENDING');

    // 2. Fetch Seller Bank Account
    const fetchSellerRes = await request.get('http://127.0.0.1:5000/api/v1/seller/bank-account', {
      headers: sellerAuthHeader,
    });
    expect(fetchSellerRes.status()).toBe(200);
    const sellerAccount = (await fetchSellerRes.json()).data;
    expect(sellerAccount.accountHolderName).toBe(`Comzilo Merchant ${testTenantId} LLC`);

    // 3. Admin List All Bank Accounts
    const adminListRes = await request.get('http://127.0.0.1:5000/api/v1/admin/bank-accounts?status=PENDING', {
      headers: adminAuthHeader,
    });
    expect(adminListRes.status()).toBe(200);
    const pendingAccounts = (await adminListRes.json()).data;
    console.log('[Playwright Bank Verification E2E] Super Admin Pending Approvals Count:', pendingAccounts.length);
    expect(pendingAccounts.some((acc: any) => acc.id === submittedAccount.id)).toBe(true);

    // 4. Admin Approves Bank Account
    const verifyRes = await request.patch(`http://127.0.0.1:5000/api/v1/admin/bank-accounts/${submittedAccount.id}/verify`, {
      headers: adminAuthHeader,
      data: {
        status: 'VERIFIED',
        remarks: 'All KYC & cancelled cheque documents verified cleanly.',
      },
    });
    expect(verifyRes.status()).toBe(200);
    const verifiedAccount = (await verifyRes.json()).data;
    console.log('[Playwright Bank Verification E2E] Admin Updated Account Status to:', verifiedAccount.status);
    expect(verifiedAccount.status).toBe('VERIFIED');

    // 5. Verify Seller Account Status Update to VERIFIED
    const reFetchSellerRes = await request.get('http://127.0.0.1:5000/api/v1/seller/bank-account', {
      headers: sellerAuthHeader,
    });
    expect(reFetchSellerRes.status()).toBe(200);
    const verifiedSellerAcc = (await reFetchSellerRes.json()).data;
    expect(verifiedSellerAcc.status).toBe('VERIFIED');
    console.log('[Playwright Bank Verification E2E] Seller Verified Bank Account Successfully!');

    // 6. Verify Multi-Tenant Isolation (Tenant #99999 should receive empty/null)
    const tenant99AuthHeader = {
      'Authorization': 'Bearer seller_token_tenant_99999',
      'X-Tenant-ID': '99999',
    };
    const tenant99Res = await request.get('http://127.0.0.1:5000/api/v1/seller/bank-account', {
      headers: tenant99AuthHeader,
    });
    expect(tenant99Res.status()).toBe(200);
    const tenant99Acc = (await tenant99Res.json()).data;
    expect(tenant99Acc).toBeNull();
    console.log('[Playwright Bank Verification E2E] Strict Multi-Tenant Isolation Verified!');
  });
});
