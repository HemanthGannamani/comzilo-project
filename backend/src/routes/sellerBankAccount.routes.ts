import { Router } from 'express';
import { SellerBankAccountController } from '../controllers/sellerBankAccount.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantResolver } from '../middleware/tenantResolver';

const router = Router();
const controller = new SellerBankAccountController();

// Seller Endpoints
router.get('/seller/bank-account', tenantResolver, controller.getSellerBankAccount);
router.post('/seller/bank-account/submit', tenantResolver, controller.submitSellerBankAccount);

// Admin Endpoints
router.get('/admin/bank-accounts', controller.listAllBankAccounts);
router.patch('/admin/bank-accounts/:id/verify', controller.verifyBankAccount);

export default router;
