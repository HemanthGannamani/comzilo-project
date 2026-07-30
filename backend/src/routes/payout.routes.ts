import { Router } from 'express';
import { PayoutController } from '../controllers/payout.controller';
import { verifyRazorpayWebhookSignature } from '../middleware/paymentSecurity.middleware';

const router = Router();
const controller = new PayoutController();

router.post('/process/:withdrawalId', controller.enqueuePayout);
router.post('/process-queue', controller.processQueue);
router.get('/queue', controller.getPayoutQueue);
router.get('/history', controller.getPayoutHistory);
router.get('/logs', controller.getPayoutLogs);
router.get('/status/:payoutId', controller.getPayoutStatus);
router.post('/webhook', verifyRazorpayWebhookSignature, controller.handleWebhook);
router.post('/webhooks/razorpay-payouts', verifyRazorpayWebhookSignature, controller.handleWebhook);

export default router;
