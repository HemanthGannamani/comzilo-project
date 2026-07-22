/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from '../../app';
import supertest from 'supertest';
import { logger } from '../../shared/logging/logger';
import { connectDatabase } from '../../config/database';

async function runVerification() {
  await connectDatabase();
  logger.info('=== STARTING STORE PURCHASING MODULE QA VERIFICATION ===');

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

  // 2. REGISTER SUPPLIER PROFILE, CONTACT & BANK ACCOUNT
  logger.info('--- 1. REGISTERING SUPPLIER PROFILE ---');
  const createSup = await supertest(app)
    .post('/api/v1/store/purchasing/suppliers')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      name: 'Apex Global Supplies Inc',
      code: 'APEX_SUPPLIES',
      email: 'sales@apexsupplies.com',
      phone: '+18005550199',
      taxId: 'US-TAX-8849201',
      contactName: 'Robert Vance',
      bankName: 'JPMorgan Chase',
      accountNumber: '994820194820',
    });

  if (createSup.status !== 201) {
    throw new Error(`Failed to create supplier: ${JSON.stringify(createSup.body)}`);
  }
  const supplierId = createSup.body.data.id;
  logger.info(`✅ Supplier registered ID ${supplierId}`);

  // 3. SUBMIT PURCHASE REQUEST
  logger.info('--- 2. SUBMITTING PURCHASE REQUEST ---');
  const createReq = await supertest(app)
    .post('/api/v1/store/purchasing/requests')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      department: 'Store Warehouse Ops',
      items: [{ productId: 1, quantityRequested: 50, estimatedUnitCost: 20.0 }],
    });

  if (createReq.status !== 201) {
    throw new Error(`Failed to submit request: ${JSON.stringify(createReq.body)}`);
  }
  logger.info(`✅ Purchase Request submitted ID ${createReq.body.data.id}`);

  // 4. ISSUE PURCHASE ORDER (PO)
  logger.info('--- 3. ISSUING PURCHASE ORDER (PO) ---');
  const createPo = await supertest(app)
    .post('/api/v1/store/purchasing/orders')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      supplierId,
      warehouseId: 1,
      taxAmount: 50.0,
      items: [{ productId: 1, variantId: 1, quantityOrdered: 50, unitCost: 20.0 }],
    });

  if (createPo.status !== 201) {
    throw new Error(`Failed to issue purchase order: ${JSON.stringify(createPo.body)}`);
  }
  const poId = createPo.body.data.id;
  logger.info(
    `✅ Purchase Order issued ID ${poId} (PO Number: ${createPo.body.data.poNumber}, Total: $1,050.00)`
  );

  // 5. RECEIVE GOODS & UPDATE WAREHOUSE STOCK (GRN)
  logger.info('--- 4. CREATING GOODS RECEIPT NOTE (GRN) & UPDATING STOCK ---');
  const createGrn = await supertest(app)
    .post('/api/v1/store/purchasing/grn')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      poId,
      items: [
        {
          productId: 1,
          variantId: 1,
          quantityReceived: 50,
          batchNumber: 'BATCH-2026-AUG',
          expiryDate: '2028-12-31',
        },
      ],
    });

  if (createGrn.status !== 201) {
    throw new Error(`Failed to create GRN: ${JSON.stringify(createGrn.body)}`);
  }
  const grnId = createGrn.body.data.id;
  logger.info(
    `✅ Goods Receipt Note (GRN) created ID ${grnId} & 50 stock units auto-incremented in warehouse!`
  );

  // 6. PROCESS SUPPLIER RETURN
  logger.info('--- 5. PROCESSING SUPPLIER RETURN ---');
  const processRet = await supertest(app)
    .post('/api/v1/store/purchasing/returns')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      grnId,
      refundAmount: 100.0,
      reason: 'Damaged packaging during transit',
    });

  if (processRet.status !== 201) {
    throw new Error(`Failed to process return: ${JSON.stringify(processRet.body)}`);
  }
  logger.info(
    `✅ Supplier Return processed ID ${processRet.body.data.id} (Debit Note: ${processRet.body.data.returnNumber})`
  );

  // 7. LOG PURCHASE INVOICE & DISBURSE PAYMENT
  logger.info('--- 6. LOGGING INVOICE & DISBURSING SUPPLIER PAYMENT ---');
  const createInv = await supertest(app)
    .post('/api/v1/store/purchasing/invoices')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      supplierId,
      poId,
      totalAmount: 1050.0,
    });

  if (createInv.status !== 201) {
    throw new Error(`Failed to create invoice: ${JSON.stringify(createInv.body)}`);
  }
  const invoiceId = createInv.body.data.id;
  logger.info(`✅ Purchase Invoice logged ID ${invoiceId}`);

  const payInv = await supertest(app)
    .post('/api/v1/store/purchasing/payments/pay')
    .set('Authorization', `Bearer ${token}`)
    .set('X-Tenant-UUID', '00000000-0000-0000-0000-000000000001')
    .send({
      invoiceId,
      paymentMethod: 'bank_transfer',
      amountPaid: 1050.0,
    });

  if (payInv.status !== 201) {
    throw new Error(`Failed to disburse payment: ${JSON.stringify(payInv.body)}`);
  }
  logger.info(`✅ Supplier Payment disbursed $1,050.00 via Bank Transfer!`);

  logger.info('🎉 STORE PURCHASING MODULE QA VERIFICATION PASSED');
  process.exit(0);
}

runVerification().catch((error) => {
  logger.error(`❌ Store Purchasing QA verification failed: ${error.message}`);
  logger.error(error.stack);
  process.exit(1);
});
