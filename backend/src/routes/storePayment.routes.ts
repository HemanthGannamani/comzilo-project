import { Router } from 'express';
import { StorePaymentController } from '../controllers/storePayment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantResolver } from '../middleware/tenantResolver';

const router = Router();

// Apply Auth and Tenant Isolation Middleware
router.use(authenticate);
router.use(tenantResolver);

// Gateways
router.get('/gateways', StorePaymentController.getGateways);
router.post('/gateways', StorePaymentController.createGateway);

// Transactions & Retry Attempts
router.get('/transactions', StorePaymentController.getTransactions);
router.post('/attempts', StorePaymentController.recordAttempt);

// Settlements & Reconciliation
router.get('/settlements', StorePaymentController.getSettlements);
router.post('/settlements', StorePaymentController.createSettlement);
router.post('/reconciliation', StorePaymentController.runReconciliation);

// Credit Notes & Customer Wallet
router.post('/credit-notes', StorePaymentController.createCreditNote);
router.get('/wallet', StorePaymentController.getWalletTransactions);
router.post('/wallet', StorePaymentController.transactWallet);

export default router;
