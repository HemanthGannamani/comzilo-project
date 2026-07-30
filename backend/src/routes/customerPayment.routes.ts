import { Router } from 'express';
import { CustomerPaymentController } from '../controllers/customerPayment.controller';
import {
  verifyCustomerIsolation,
  preventDuplicatePayments,
  preventReplayAttacks,
} from '../middleware/paymentSecurity.middleware';

const router = Router();
const controller = new CustomerPaymentController();

router.use(verifyCustomerIsolation);
router.use(preventReplayAttacks);

router.get('/payments', controller.getPayments);
router.get('/invoices', controller.getInvoices);
router.get('/refunds', controller.getRefunds);
router.post('/payments/retry/:orderId', preventDuplicatePayments, controller.retryPayment);
router.post('/payments/email-receipt/:orderId', controller.sendEmailReceipt);
router.post('/payments/whatsapp-receipt/:orderId', controller.sendWhatsAppReceipt);

export default router;
