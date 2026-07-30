import { test, expect } from '@playwright/test';
import * as crypto from 'crypto';

test.describe('Razorpay Payout Architecture E2E Test Suite', () => {
  test('Complete Provider Abstraction, Queue, History, Logs, & Webhook Lifecycle', async ({ request }) => {
    console.log('[Playwright E2E] Testing Razorpay Payout Architecture...');

    // 1. Create Seller Withdrawal Request
    const withdrawRes = await request.post('http://127.0.0.1:5000/api/v1/seller/wallet/withdraw', {
      data: {
        amount: 50.00,
        bankDetails: {
          bankName: 'ICICI Bank',
          accountNumber: '99812488100',
          ifscCode: 'ICIC0009988',
          accountHolderName: 'Comzilo Merchant Vendor',
        },
      },
      headers: { 'x-tenant-id': '47' },
    });
    expect(withdrawRes.status()).toBe(201);
    const withdrawData = await withdrawRes.json();
    console.log('[Playwright E2E] Created Withdrawal Request:', withdrawData.data.withdrawalNumber);

    // Fetch withdrawal ID from all withdrawals list
    const allWthRes = await request.get('http://127.0.0.1:5000/api/v1/admin/withdrawals/all-withdrawals', {
      headers: { 'x-tenant-id': '47' },
    });
    const createdWth = (await allWthRes.json()).data.find(
      (w: any) => w.withdrawal_number === withdrawData.data.withdrawalNumber
    );
    expect(createdWth).toBeDefined();
    const withdrawalId = createdWth.id;

    // 2. Enqueue Payout into payout_queue
    const enqueueRes = await request.post(`http://127.0.0.1:5000/api/v1/admin/payouts/process/${withdrawalId}`);
    expect(enqueueRes.status()).toBe(201);
    const enqueueData = await enqueueRes.json();
    console.log('[Playwright E2E] Enqueued Payout Item:', enqueueData.data);
    expect(enqueueData.data.status).toBe('queued');

    // 3. View Active Payout Queue
    const queueRes = await request.get('http://127.0.0.1:5000/api/v1/admin/payouts/queue');
    expect(queueRes.status()).toBe(200);
    const queueData = await queueRes.json();
    console.log('[Playwright E2E] Payout Queue Items Count:', queueData.data.length);
    expect(queueData.data.length).toBeGreaterThan(0);

    // 4. Trigger Queue Worker Processor (uses IPayoutProvider abstraction)
    const processRes = await request.post('http://127.0.0.1:5000/api/v1/admin/payouts/process-queue');
    expect(processRes.status()).toBe(200);

    // 5. Verify Payout History & Status
    const historyRes = await request.get('http://127.0.0.1:5000/api/v1/admin/payouts/history');
    expect(historyRes.status()).toBe(200);
    const historyData = await historyRes.json();
    const processedPayout = historyData.data.find((h: any) => Number(h.withdrawal_id) === withdrawalId);
    expect(processedPayout).toBeDefined();
    console.log('[Playwright E2E] Payout History Record:', processedPayout);
    expect(processedPayout.provider).toBe('MOCK');
    expect(processedPayout.status).toBe('processed');
    expect(processedPayout.utr).toBeDefined();

    // 6. Simulate Razorpay Webhook Callback Event
    const rzpPayoutId = processedPayout.razorpay_payout_id || 'pout_mock_test_123';
    const webhookPayload = {
      event: 'payout.processed',
      payload: {
        payout: {
          entity: {
            id: rzpPayoutId,
            status: 'processed',
            utr: 'UTR_WEBHOOK_VERIFIED_998',
          },
        },
      },
    };
    const webhookSecret = 'gjwzI3mm19CcyaShfXgheJSR';
    const signature = crypto.createHmac('sha256', webhookSecret).update(JSON.stringify(webhookPayload)).digest('hex');

    const webhookRes = await request.post('http://127.0.0.1:5000/api/v1/admin/payouts/webhook', {
      headers: {
        'x-razorpay-signature': signature,
        'content-type': 'application/json',
      },
      data: webhookPayload,
    });
    expect(webhookRes.status()).toBe(200);
    console.log('[Playwright E2E] Webhook processed cleanly!');

    // 7. Verify API Audit Logs
    const logsRes = await request.get('http://127.0.0.1:5000/api/v1/admin/payouts/logs');
    expect(logsRes.status()).toBe(200);
    const logsData = await logsRes.json();
    console.log('[Playwright E2E] Audit Logs Count:', logsData.data.length);
    expect(logsData.data.length).toBeGreaterThan(0);
  });
});
