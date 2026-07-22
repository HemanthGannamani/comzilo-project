import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { paymentValidation } from '../validations/payment.validation';

const router = Router();
const controller = new PaymentController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get(
  '/',
  requirePermission('payment.read'),
  validateRequest({ query: paymentValidation.listPayments }),
  controller.listPayments
);

router.post(
  '/',
  requirePermission('payment.create'),
  validateRequest({ body: paymentValidation.createPayment }),
  controller.createPayment
);

router.get('/:id', requirePermission('payment.read', 'id'), controller.getPayment);

router.post(
  '/:id/authorize',
  requirePermission('payment.authorize', 'id'),
  controller.authorizePayment
);
router.post('/:id/capture', requirePermission('payment.capture', 'id'), controller.capturePayment);
router.post('/:id/cancel', requirePermission('payment.cancel', 'id'), controller.cancelPayment);
router.post('/:id/fail', requirePermission('payment.authorize', 'id'), controller.failPayment);

router.post(
  '/:id/refund',
  requirePermission('payment.refund', 'id'),
  validateRequest({ body: paymentValidation.refundPayment }),
  controller.refundPayment
);

export default router;
export { router as paymentRoutes };
