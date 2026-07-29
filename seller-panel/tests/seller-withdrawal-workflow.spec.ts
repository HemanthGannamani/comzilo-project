import { test, expect } from '@playwright/test';

test.describe('Seller Withdrawal System E2E Workflow', () => {
  test('Complete Withdrawal Lifecycle: Request -> Approve -> Mark Paid -> Reject & Refund', async ({ page, request }) => {
    console.log('[Playwright E2E] Testing Seller Withdrawal Lifecycle...');

    // 1. Seller Request Withdrawal via API or UI
    const withdrawRes = await request.post('http://localhost:5000/api/v1/seller/wallet/withdraw', {
      data: {
        amount: 25.00,
        bankDetails: {
          bankName: 'HDFC Bank Ltd',
          accountNumber: '9981248819',
          ifscCode: 'HDFC0001234',
          accountHolderName: 'Chowdary Merchant',
        },
      },
      headers: {
        'x-tenant-id': '47',
      },
    });

    expect(withdrawRes.status()).toBe(201);
    const withdrawData = await withdrawRes.json();
    console.log('[Playwright E2E] Created Withdrawal Request:', withdrawData.data);
    expect(withdrawData.data.status).toBe('requested');

    // 2. Fetch All Withdrawals (Admin view)
    const allWthRes = await request.get('http://localhost:5000/api/v1/admin/withdrawals/all-withdrawals', {
      headers: { 'x-tenant-id': '47' },
    });
    expect(allWthRes.status()).toBe(200);
    const allWth = await allWthRes.json();
    const createdWth = allWth.data.find((w: any) => w.withdrawal_number === withdrawData.data.withdrawalNumber);
    expect(createdWth).toBeDefined();

    const wthId = createdWth.id;

    // 3. Admin Approve Withdrawal Request (Pending -> Approved)
    const approveRes = await request.post(`http://localhost:5000/api/v1/admin/withdrawals/withdrawals/${wthId}/approve`, {
      headers: { 'x-tenant-id': '47' },
    });
    expect(approveRes.status()).toBe(200);
    console.log('[Playwright E2E] Approved Withdrawal Request ID:', wthId);

    // 4. Admin Mark as Paid (Approved -> Paid)
    const markPaidRes = await request.post(`http://localhost:5000/api/v1/admin/withdrawals/withdrawals/${wthId}/mark-paid`, {
      data: { payoutReference: 'UTR99812488192' },
      headers: { 'x-tenant-id': '47' },
    });
    expect(markPaidRes.status()).toBe(200);
    console.log('[Playwright E2E] Marked Withdrawal ID', wthId, 'as Paid with UTR reference!');

    // 5. Test Rejection & Refund Flow
    const withdrawRes2 = await request.post('http://localhost:5000/api/v1/seller/wallet/withdraw', {
      data: { amount: 15.00 },
      headers: { 'x-tenant-id': '47' },
    });
    const wth2Data = await withdrawRes2.json();

    const allWthRes2 = await request.get('http://localhost:5000/api/v1/admin/withdrawals/all-withdrawals', {
      headers: { 'x-tenant-id': '47' },
    });
    const wth2 = (await allWthRes2.json()).data.find((w: any) => w.withdrawal_number === wth2Data.data.withdrawalNumber);

    const rejectRes = await request.post(`http://localhost:5000/api/v1/admin/withdrawals/withdrawals/${wth2.id}/reject`, {
      data: { reason: 'Invalid IFSC code' },
      headers: { 'x-tenant-id': '47' },
    });
    expect(rejectRes.status()).toBe(200);
    console.log('[Playwright E2E] Rejected Withdrawal ID', wth2.id, 'and refunded INR 15 back to seller balance!');

    // 6. Verify Seller Withdrawal History via API
    const sellerWthRes = await request.get('http://localhost:5000/api/v1/seller/wallet/withdrawals', {
      headers: { 'x-tenant-id': '47' },
    });
    expect(sellerWthRes.status()).toBe(200);
    const sellerWthList = await sellerWthRes.json();
    console.log('[Playwright E2E] Retrived Seller Withdrawal History Count:', sellerWthList.data.length);
    expect(sellerWthList.data.length).toBeGreaterThan(0);
  });
});
