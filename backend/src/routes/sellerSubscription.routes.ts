import { Router } from 'express';
import { SellerSubscriptionController } from '../controllers/sellerSubscription.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantResolver } from '../middleware/tenantResolver';

const router = Router();
const controller = new SellerSubscriptionController();

router.use(tenantResolver);
router.use(authenticate);

router.get('/', controller.getCurrentSubscription);
router.post('/checkout', controller.createCheckoutSession);
router.post('/verify', controller.verifyAndActivateSubscription);
router.get('/invoices', controller.getInvoices);
router.get('/saas-reports', controller.getSaaSReports);

export default router;
