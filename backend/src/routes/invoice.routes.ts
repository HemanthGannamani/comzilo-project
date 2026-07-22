import { Router } from 'express';
import { InvoiceController } from '../controllers/invoice.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { paymentValidation } from '../validations/payment.validation';

const router = Router();
const controller = new InvoiceController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get(
  '/',
  requirePermission('invoice.read'),
  validateRequest({ query: paymentValidation.listInvoices }),
  controller.listInvoices
);

router.post(
  '/',
  requirePermission('invoice.create'),
  validateRequest({ body: paymentValidation.createInvoice }),
  controller.createInvoice
);

router.get('/:id', requirePermission('invoice.read', 'id'), controller.getInvoice);

router.put(
  '/:id',
  requirePermission('invoice.update', 'id'),
  validateRequest({ body: paymentValidation.updateInvoice }),
  controller.updateInvoice
);

export default router;
export { router as invoiceRoutes };
