import { test, expect } from '@playwright/test';

test.describe('Customer Payment & Receipt Center E2E Workflow', () => {
  test('Complete Customer Payment History, Invoices, Refunds, Payment Retry, Email & WhatsApp Receipts', async ({ request }) => {
    console.log('[Playwright E2E] Testing Customer Payment Center...');

    // 1. Fetch Customer Payments & Summary
    const paymentsRes = await request.get('http://127.0.0.1:5000/api/v1/customer/payments?customerId=1');
    expect(paymentsRes.status()).toBe(200);
    const paymentsData = await paymentsRes.json();
    console.log('[Playwright E2E] Customer Payments Summary:', paymentsData.data.summary);

    expect(paymentsData.data.summary.totalPayments).toBeGreaterThanOrEqual(0);
    expect(paymentsData.data.payments).toBeDefined();

    // 2. Fetch Customer Invoices
    const invoicesRes = await request.get('http://127.0.0.1:5000/api/v1/customer/invoices?customerId=1');
    expect(invoicesRes.status()).toBe(200);
    const invoicesData = await invoicesRes.json();
    console.log('[Playwright E2E] Invoices Count:', invoicesData.data.length);
    expect(invoicesData.data).toBeDefined();

    // 3. Fetch Customer Refunds
    const refundsRes = await request.get('http://127.0.0.1:5000/api/v1/customer/refunds?customerId=1');
    expect(refundsRes.status()).toBe(200);
    const refundsData = await refundsRes.json();
    console.log('[Playwright E2E] Refunds Count:', refundsData.data.length);

    // 4. Retry Failed Payment Endpoint
    const retryRes = await request.post('http://127.0.0.1:5000/api/v1/customer/payments/retry/1');
    expect(retryRes.status()).toBe(200);
    const retryData = await retryRes.json();
    expect(retryData.data.razorpayKeyId).toBeDefined();
    console.log('[Playwright E2E] Payment Retry Session Initialized:', retryData.data.razorpayOrderId);

    // 5. Send Email Receipt
    const emailRes = await request.post('http://127.0.0.1:5000/api/v1/customer/payments/email-receipt/1', {
      data: { email: 'customer@comzilo.com' },
    });
    expect(emailRes.status()).toBe(200);
    const emailData = await emailRes.json();
    expect(emailData.data.status).toBe('delivered');
    console.log('[Playwright E2E] Email Receipt Dispatched Cleanly!');

    // 6. Send WhatsApp Receipt
    const waRes = await request.post('http://127.0.0.1:5000/api/v1/customer/payments/whatsapp-receipt/1', {
      data: { phone: '+919988776655' },
    });
    expect(waRes.status()).toBe(200);
    const waData = await waRes.json();
    expect(waData.data.status).toBe('sent');
    console.log('[Playwright E2E] WhatsApp Receipt Dispatched Cleanly!');
  });
});
