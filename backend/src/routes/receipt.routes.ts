import { Router } from 'express';
import { ReceiptController } from '../controllers/receipt.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { posValidation } from '../validations/pos.validation';

const router = Router();
const controller = new ReceiptController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get(
  '/',
  requirePermission('receipt.read'),
  validateRequest({ query: posValidation.listReceipts }),
  controller.listReceipts
);

router.get('/:id', requirePermission('receipt.read', 'id'), controller.getReceipt);

export default router;
export { router as receiptRoutes };
