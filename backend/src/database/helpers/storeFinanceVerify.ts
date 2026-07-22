/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from '../../app';
import supertest from 'supertest';
import { logger } from '../../shared/logging/logger';
import { connectDatabase } from '../../config/database';

async function runVerification() {
  await connectDatabase();
  logger.info('=== STARTING STORE FINANCE MODULE QA VERIFICATION ===');

  // 1. Authenticate Seller Admin
  const loginRes = await supertest(app)
    .post('/api/v1/auth/login')
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      email: 'admin@comzilo.com',
      password: 'SuperAdminSecurePassword2026!',
    });

  const token = loginRes.body.data.accessToken;
  logger.info('Seller / Store Admin authenticated successfully.');

  // 2. CREATE CHART OF ACCOUNTS
  logger.info('--- 1. SETTING UP CHART OF ACCOUNTS ---');
  const createCash = await supertest(app)
    .post('/api/v1/store/finance/accounts')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      code: '1010',
      name: 'Main Operating Cash Account',
      type: 'asset',
      initialBalance: 1000.0,
    });

  if (createCash.status !== 201) {
    throw new Error(`Failed to create cash account: ${JSON.stringify(createCash.body)}`);
  }
  const cashAccId = createCash.body.data.id;

  const createRev = await supertest(app)
    .post('/api/v1/store/finance/accounts')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      code: '4010',
      name: 'E-commerce Retail Sales Revenue',
      type: 'revenue',
      initialBalance: 0.0,
    });

  if (createRev.status !== 201) {
    throw new Error(`Failed to create revenue account: ${JSON.stringify(createRev.body)}`);
  }
  const revAccId = createRev.body.data.id;
  logger.info(
    `✅ Chart of accounts setup completed (Cash Acc: ${cashAccId}, Revenue Acc: ${revAccId})`
  );

  // 3. POST DOUBLE-ENTRY JOURNAL & GENERAL LEDGER
  logger.info('--- 2. POSTING DOUBLE-ENTRY JOURNAL ENTRY ---');
  const postJe = await supertest(app)
    .post('/api/v1/store/finance/journals')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      description: 'Record Retail POS Sales Settlement',
      entryDate: '2026-07-22',
      lines: [
        { accountId: cashAccId, debitAmount: 500.0, creditAmount: 0.0, memo: 'Cash Received' },
        { accountId: revAccId, debitAmount: 0.0, creditAmount: 500.0, memo: 'Sales Earned' },
      ],
    });

  if (postJe.status !== 201) {
    throw new Error(`Failed to post journal entry: ${JSON.stringify(postJe.body)}`);
  }
  logger.info(
    `✅ Double-entry Journal Entry posted ID ${postJe.body.data.id} (Debit $500.00 === Credit $500.00)`
  );

  // 4. ACCOUNTS PAYABLE (VENDOR BILL) & ACCOUNTS RECEIVABLE (INVOICE)
  logger.info('--- 3. LOGGING ACCOUNTS PAYABLE & RECEIVABLES ---');
  const createBill = await supertest(app)
    .post('/api/v1/store/finance/payables')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      supplierId: 1,
      totalAmount: 200.0,
      dueDate: '2026-08-15',
    });

  if (createBill.status !== 201) {
    throw new Error(`Failed to create vendor bill: ${JSON.stringify(createBill.body)}`);
  }
  logger.info(`✅ AP Vendor Bill logged ID ${createBill.body.data.id}`);

  const createInv = await supertest(app)
    .post('/api/v1/store/finance/receivables')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      customerId: 1,
      totalAmount: 350.0,
      dueDate: '2026-08-20',
    });

  if (createInv.status !== 201) {
    throw new Error(`Failed to create customer invoice: ${JSON.stringify(createInv.body)}`);
  }
  logger.info(`✅ AR Customer Invoice logged ID ${createInv.body.data.id}`);

  // 5. BANKING & RECONCILIATION
  logger.info('--- 4. BANK ACCOUNT CREATION & RECONCILIATION ---');
  const createBank = await supertest(app)
    .post('/api/v1/store/finance/banks')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      bankName: 'Silicon Valley Commercial Bank',
      accountNumber: 'SVB-99201948',
      initialBalance: 15000.0,
    });

  if (createBank.status !== 201) {
    throw new Error(`Failed to create bank account: ${JSON.stringify(createBank.body)}`);
  }
  const bankId = createBank.body.data.id;
  logger.info(`✅ Bank Account created ID ${bankId}`);

  const reconBank = await supertest(app)
    .post('/api/v1/store/finance/banks/reconcile')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      bankAccountId: bankId,
      statementDate: '2026-07-22',
      endingBalance: 15000.0,
    });

  if (reconBank.status !== 201) {
    throw new Error(`Failed to reconcile bank account: ${JSON.stringify(reconBank.body)}`);
  }
  logger.info('✅ Bank statement reconciled successfully.');

  // 6. GENERATE FINANCIAL STATEMENTS
  logger.info('--- 5. GENERATING FINANCIAL REPORTS & STATEMENTS ---');
  const getReports = await supertest(app)
    .get('/api/v1/store/finance/reports')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001');

  if (getReports.status !== 200) {
    throw new Error(`Failed to generate financial reports: ${JSON.stringify(getReports.body)}`);
  }
  const data = getReports.body.data;
  logger.info(`✅ Financial Reports generated successfully!`);
  logger.info(`   Profit & Loss Net Income: $${data.profitAndLoss.netIncome}`);
  logger.info(`   Balance Sheet Check (Balanced: ${data.balanceSheet.isBalanced})`);

  logger.info('🎉 STORE FINANCE MODULE QA VERIFICATION PASSED');
  process.exit(0);
}

runVerification().catch((error) => {
  logger.error(`❌ Store Finance QA verification failed: ${error.message}`);
  logger.error(error.stack);
  process.exit(1);
});
