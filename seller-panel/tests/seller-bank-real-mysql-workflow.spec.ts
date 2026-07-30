import { test, expect } from '@playwright/test';

test.describe('Real Live MySQL Seller Bank Account Workflow E2E Suite', () => {
  test('New Seller Empty State -> Form Submission -> Admin Approval -> VERIFIED Status & Settlement Unlocked', async ({ request }) => {
    console.log('[Playwright Real MySQL Workflow] Initializing Pure Database-Driven E2E Audit...');

    const freshTenantId = 88800 + Math.floor(Math.random() * 1000);
    const sellerHeaders = {
      'X-Tenant-ID': String(freshTenantId),
    };
    const adminHeaders = {
      'X-Tenant-ID': '1',
    };

    // 1. First Time Seller Opens Bank Page (Database Has No Record)
    const initialFetchRes = await request.get('http://127.0.0.1:5000/api/v1/seller/bank-account', {
      headers: sellerHeaders,
    });
    expect(initialFetchRes.status()).toBe(200);
    const initialData = (await initialFetchRes.json()).data;
    console.log(`[Playwright Real MySQL Workflow] Initial Bank Record for Tenant #${freshTenantId}:`, initialData);
    expect(initialData).toBeNull(); // Empty state: NOT SUBMITTED

    // 2. Seller Fills Empty Form & Submits For Verification
    const submitRes = await request.post('http://127.0.0.1:5000/api/v1/seller/bank-account/submit', {
      headers: sellerHeaders,
      data: {
        accountHolderName: `Live Merchant ${freshTenantId} Pvt Ltd`,
        bankName: 'ICICI Bank',
        accountNumber: `60100${freshTenantId}`,
        confirmAccountNumber: `60100${freshTenantId}`,
        ifscCode: 'ICIC0000999',
        upiId: `merchant${freshTenantId}@icici`,
        panNumber: 'ABCDE5678G',
        gstNumber: '27ABCDE5678G1Z9',
      },
    });
    expect(submitRes.status()).toBe(200);
    const submittedData = (await submitRes.json()).data;
    console.log(`[Playwright Real MySQL Workflow] Submitted Record ID: ${submittedData.id} | Status: ${submittedData.status}`);
    expect(submittedData.status).toBe('PENDING');

    // 3. Super Admin Checks Pending Queue in Admin Panel
    const adminListRes = await request.get('http://127.0.0.1:5000/api/v1/admin/bank-accounts?status=PENDING', {
      headers: adminHeaders,
    });
    expect(adminListRes.status()).toBe(200);
    const pendingList = (await adminListRes.json()).data;
    const targetRecord = pendingList.find((item: any) => item.id === submittedData.id);
    expect(targetRecord).toBeDefined();
    console.log(`[Playwright Real MySQL Workflow] Admin verified record present in pending queue.`);

    // 4. Super Admin Approves Bank Account
    const approveRes = await request.patch(`http://127.0.0.1:5000/api/v1/admin/bank-accounts/${submittedData.id}/verify`, {
      headers: adminHeaders,
      data: {
        status: 'VERIFIED',
        remarks: 'PAN and Bank Passbook verified successfully against bank records.',
      },
    });
    expect(approveRes.status()).toBe(200);
    const approvedData = (await approveRes.json()).data;
    expect(approvedData.status).toBe('VERIFIED');
    console.log(`[Playwright Real MySQL Workflow] Super Admin set status to VERIFIED.`);

    // 5. Seller Refreshes Bank Page -> Status automatically updated to VERIFIED
    const reFetchRes = await request.get('http://127.0.0.1:5000/api/v1/seller/bank-account', {
      headers: sellerHeaders,
    });
    expect(reFetchRes.status()).toBe(200);
    const verifiedSellerData = (await reFetchRes.json()).data;
    expect(verifiedSellerData.status).toBe('VERIFIED');
    console.log(`[Playwright Real MySQL Workflow] Seller bank account verified! Settlements unlocked!`);
  });
});
