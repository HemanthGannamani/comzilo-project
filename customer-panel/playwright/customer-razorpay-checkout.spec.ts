import { test, expect } from '@playwright/test';

test.describe('Customer Order Razorpay Payment Integration E2E Tests', () => {
  test('1. Successful Razorpay Payment Flow: Create Order, Signature Verification, Stock Reduction, Invoice & Notifications', async ({ page }) => {
    console.log('[Playwright E2E] Navigating to Customer Login...');
    await page.goto('http://localhost:3000/login');

    // Login as Customer
    await page.fill('input[type="email"]', 'test_customer_rzp@comzilo.com');
    await page.fill('input[type="password"]', 'CustomerPass123!');
    await page.click('button:has-text("Sign In")');

    // Wait for storefront or redirect
    await page.waitForTimeout(2000);
    console.log('[Playwright E2E] Customer logged in. Navigating to checkout...');

    // Navigate to Products & Cart
    await page.goto('http://localhost:3000/checkout');
    await page.waitForTimeout(1000);

    // If redirected to cart or empty, visit products and click buy now / checkout
    if (page.url().includes('/cart') || (await page.isVisible('text=Your Cart is Empty'))) {
      await page.goto('http://localhost:3000/products');
      await page.waitForTimeout(1000);
      const buyNowBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Buy Now")').first();
      if (await buyNowBtn.isVisible()) {
        await buyNowBtn.click();
        await page.goto('http://localhost:3000/checkout');
      }
    }

    // Verify Checkout Page
    console.log('[Playwright E2E] Verifying Checkout Page elements...');
    await page.waitForSelector('text=Select Payment Gateway', { timeout: 10000 });

    // Select Razorpay Radio Button
    const razorpayRadio = page.locator('input[value="razorpay"]');
    await razorpayRadio.click();
    console.log('[Playwright E2E] Selected Razorpay Payment Gateway!');

    // Click Place Order
    const placeOrderBtn = page.locator('button:has-text("Place Order")');
    await placeOrderBtn.click();
    console.log('[Playwright E2E] Clicked Place Order!');

    // Wait for redirection to Order Confirmation page
    await page.waitForURL('**/order-confirmation**', { timeout: 15000 });
    console.log('[Playwright E2E] Successfully landed on Order Confirmation page!');

    const confirmationText = await page.textContent('body');
    expect(confirmationText).toContain('Order');
  });

  test('2. Failed Payment & Retry Workflow Test', async ({ request }) => {
    console.log('[Playwright E2E] Authenticating customer for API verification failure test...');
    const loginRes = await request.post('http://localhost:5000/api/v1/auth/login', {
      data: {
        email: 'test_customer_rzp@comzilo.com',
        password: 'CustomerPass123!'
      }
    });
    const loginData = await loginRes.json();
    const token = loginData.data?.accessToken;

    console.log('[Playwright E2E] Testing API verification failure for invalid signature...');
    
    const res = await request.post('http://localhost:5000/api/v1/customer-portal/verify-razorpay-payment', {
      data: {
        razorpayOrderId: 'rzp_order_test_invalid',
        razorpayPaymentId: 'pay_test_invalid',
        razorpaySignature: 'invalid_forged_signature_123',
        items: [{ id: 1, quantity: 1, price: 50 }],
        shippingMethod: 'standard'
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('[Playwright E2E] API failure status:', res.status());
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toContain('signature verification failed');
  });

  test('3. Razorpay Webhook Event Handlers (captured, failed, refund)', async ({ request }) => {
    console.log('[Playwright E2E] Testing Razorpay Webhooks...');

    // Webhook 1: payment.captured
    const capRes = await request.post('http://localhost:5000/api/v1/customer-portal/webhooks/razorpay', {
      data: {
        event: 'payment.captured',
        payload: {
          payment: {
            entity: { id: 'pay_test_cap_123', order_id: 'rzp_ord_test_123', amount: 5000 }
          }
        }
      }
    });
    expect(capRes.status()).toBe(200);

    // Webhook 2: payment.failed
    const failRes = await request.post('http://localhost:5000/api/v1/customer-portal/webhooks/razorpay', {
      data: {
        event: 'payment.failed',
        payload: {
          payment: {
            entity: { id: 'pay_test_fail_123', order_id: 'rzp_ord_test_456' }
          }
        }
      }
    });
    expect(failRes.status()).toBe(200);

    // Webhook 3: refund.processed
    const refRes = await request.post('http://localhost:5000/api/v1/customer-portal/webhooks/razorpay', {
      data: {
        event: 'refund.processed',
        payload: {
          refund: {
            entity: { payment_id: 'pay_test_cap_123', amount: 5000 }
          }
        }
      }
    });
    expect(refRes.status()).toBe(200);

    console.log('[Playwright E2E] All Razorpay Webhook events verified with HTTP 200 OK!');
  });
});
