import { Router } from 'express';
import { StoreFinanceController } from '../controllers/storeFinance.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantResolver } from '../middleware/tenantResolver';

const router = Router();

// Apply Auth and Tenant Isolation Middleware
router.use(authenticate);
router.use(tenantResolver);

// Chart of Accounts
router.get('/accounts', StoreFinanceController.getAccounts);
router.post('/accounts', StoreFinanceController.createAccount);

// Journal Entries & General Ledger
router.post('/journals', StoreFinanceController.postJournalEntry);
router.get('/general-ledger', StoreFinanceController.getGeneralLedger);

// Payables & Receivables
router.get('/payables', StoreFinanceController.getVendorBills);
router.post('/payables', StoreFinanceController.createVendorBill);
router.get('/receivables', StoreFinanceController.getCustomerInvoices);
router.post('/receivables', StoreFinanceController.createCustomerInvoice);

// Banking & Reconciliations
router.get('/banks', StoreFinanceController.getBankAccounts);
router.post('/banks', StoreFinanceController.createBankAccount);
router.post('/banks/reconcile', StoreFinanceController.reconcileBankAccount);

// Financial Statements & Reports
router.get('/reports', StoreFinanceController.getFinancialStatements);

export default router;
