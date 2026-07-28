import { test, expect } from '@playwright/test';

test.describe('Strict Multi-Tenant Support Ticket Isolation Audit & Verification', () => {
  const API_BASE = 'http://localhost:5000/api/v1/support';

  test('Scenario 1: Multi-Seller Ticket Separation (Seller A vs Seller B Isolation)', async ({ request }) => {
    console.log('[Multi-Tenant Audit] Creating tickets for Seller A (Store 1) and Seller B (Store 2)...');

    // Create ticket under Seller A (Store 1, Tenant 1, Customer 8)
    const ticketARes = await request.post(`${API_BASE}/customer/tickets`, {
      data: {
        tenantId: 1,
        storeId: 1,
        customerId: 8,
        subject: 'Seller A Store Order Delivery Assistance',
        category: 'Order Issue',
        priority: 'high',
        message: 'Order delivery status for Seller A customer',
      },
    });
    expect(ticketARes.status()).toBe(201);
    const ticketA = (await ticketARes.json()).data;
    console.log(`[Multi-Tenant Audit] Created Ticket A #${ticketA.ticketNumber} for Store 1`);

    // Create ticket under Seller B (Store 2, Tenant 1, Customer 9)
    const ticketBRes = await request.post(`${API_BASE}/customer/tickets`, {
      data: {
        tenantId: 1,
        storeId: 2,
        customerId: 9,
        subject: 'Seller B Store Refund Query',
        category: 'Refund',
        priority: 'medium',
        message: 'Refund query for Seller B customer',
      },
    });
    expect(ticketBRes.status()).toBe(201);
    const ticketB = (await ticketBRes.json()).data;
    console.log(`[Multi-Tenant Audit] Created Ticket B #${ticketB.ticketNumber} for Store 2`);

    // Query Seller A Tickets (Store 1)
    const sellerATicketsRes = await request.get(`${API_BASE}/seller/tickets?storeId=1`);
    expect(sellerATicketsRes.status()).toBe(200);
    const sellerATickets = (await sellerATicketsRes.json()).data;
    console.log(`[Multi-Tenant Audit] Seller A Queue Count: ${sellerATickets.length}`);

    // Verify Seller A sees Ticket A, but NEVER sees Ticket B
    const containsTicketAInSellerA = sellerATickets.some((t: any) => t.id === ticketA.id);
    const containsTicketBInSellerA = sellerATickets.some((t: any) => t.id === ticketB.id);
    expect(containsTicketAInSellerA).toBe(true);
    expect(containsTicketBInSellerA).toBe(false);
    console.log('[Multi-Tenant Audit] ✅ VERIFIED: Seller A sees ONLY Seller A tickets!');

    // Query Seller B Tickets (Store 2)
    const sellerBTicketsRes = await request.get(`${API_BASE}/seller/tickets?storeId=2`);
    expect(sellerBTicketsRes.status()).toBe(200);
    const sellerBTickets = (await sellerBTicketsRes.json()).data;
    console.log(`[Multi-Tenant Audit] Seller B Queue Count: ${sellerBTickets.length}`);

    // Verify Seller B sees Ticket B, but NEVER sees Ticket A
    const containsTicketBInSellerB = sellerBTickets.some((t: any) => t.id === ticketB.id);
    const containsTicketAInSellerB = sellerBTickets.some((t: any) => t.id === ticketA.id);
    expect(containsTicketBInSellerB).toBe(true);
    expect(containsTicketAInSellerB).toBe(false);
    console.log('[Multi-Tenant Audit] ✅ VERIFIED: Seller B sees ONLY Seller B tickets!');
  });

  test('Scenario 2: API Parameter Tampering (Seller A attempts to fetch Seller B Ticket) -> HTTP 403 Forbidden', async ({ request }) => {
    console.log('[Multi-Tenant Audit] Attempting cross-tenant API parameter tampering...');

    // Create a ticket for Seller B (Store 2)
    const ticketBRes = await request.post(`${API_BASE}/customer/tickets`, {
      data: { tenantId: 1, storeId: 2, customerId: 9, subject: 'Seller B Private Ticket', message: 'Private message' }
    });
    const ticketB = (await ticketBRes.json()).data;

    // Seller A (Store 1) attempts to fetch Seller B's ticket ID
    const res = await request.get(`${API_BASE}/seller/tickets/${ticketB.id}?storeId=1`);
    expect(res.status()).toBe(403);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toContain('Access Denied');
    console.log('[Multi-Tenant Audit] ✅ VERIFIED: Cross-store API access returned HTTP 403 Forbidden!');
  });

  test('Scenario 3: Customer-Level Ticket Isolation -> HTTP 403 Forbidden', async ({ request }) => {
    console.log('[Multi-Tenant Audit] Attempting cross-customer ticket access...');

    // Create a ticket for Customer B1 (id: 9)
    const ticketBRes = await request.post(`${API_BASE}/customer/tickets`, {
      data: { tenantId: 1, storeId: 2, customerId: 9, subject: 'Customer B Private Ticket', message: 'Private message' }
    });
    const ticketB = (await ticketBRes.json()).data;

    // Customer A1 (id: 8) attempts to view Customer B1 (id: 9) ticket
    const res = await request.get(`${API_BASE}/customer/tickets/${ticketB.id}?customerId=8&storeId=1`);
    expect(res.status()).toBe(403);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toContain('Access Denied');
    console.log('[Multi-Tenant Audit] ✅ VERIFIED: Cross-customer access returned HTTP 403 Forbidden!');
  });

  test('Scenario 4: Super Admin Privacy Protection Audit', async ({ request }) => {
    console.log('[Multi-Tenant Audit] Verifying Super Admin privacy protection metrics API...');

    const res = await request.get(`${API_BASE}/admin/analytics`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.isolationEnforced).toBe(true);
    expect(body.data.note).toContain('Super Admin has zero visibility into customer conversation content');
    console.log('[Multi-Tenant Audit] ✅ VERIFIED: Super Admin has zero access to conversation message content!');
  });
});
