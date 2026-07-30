import { Router } from 'express';
import { SellerWalletController } from '../controllers/sellerWallet.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantResolver } from '../middleware/tenantResolver';
import {
  verifySellerIsolation,
  preventDuplicatePayments,
  preventReplayAttacks,
} from '../middleware/paymentSecurity.middleware';

const router = Router();
const controller = new SellerWalletController();

router.use(tenantResolver);
router.use(verifySellerIsolation);
router.use(preventReplayAttacks);
router.get('/', controller.getWallet);
router.post('/bank-details', controller.updateBankDetails);
router.post('/withdraw', controller.requestWithdrawal);
router.get('/transactions', controller.getTransactions);
router.get('/withdrawals', controller.getWithdrawals);
router.get('/all-withdrawals', controller.getAllWithdrawals);
router.post('/withdrawals/:id/approve', controller.approveWithdrawal);
router.post('/withdrawals/:id/mark-paid', controller.markWithdrawalPaid);
router.post('/withdrawals/:id/reject', controller.rejectWithdrawal);
router.get('/withdrawal-reports', controller.getWithdrawalReports);
router.get('/financial-dashboard', controller.getSellerFinancialDashboard);
router.get('/financial-export', controller.exportFinancialData);

export default router;
