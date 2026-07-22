import { Router } from 'express';
import { StockAdjustmentController } from '../controllers/stockAdjustment.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { adjustmentValidation } from '../validations/stockAdjustment.validation';

const router = Router();
const controller = new StockAdjustmentController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get(
  '/',
  requirePermission('inventory.read'),
  validateRequest({ query: adjustmentValidation.listAdjustments }),
  controller.listAdjustments
);

router.post(
  '/',
  requirePermission('inventory.adjust'),
  validateRequest({ body: adjustmentValidation.createAdjustment }),
  controller.createAdjustment
);

router.get('/:id', requirePermission('inventory.read', 'id'), controller.getAdjustment);

router.post(
  '/:id/approve',
  requirePermission('inventory.approve_adjustment', 'id'),
  controller.approveAdjustment
);

router.post(
  '/:id/reject',
  requirePermission('inventory.approve_adjustment', 'id'),
  controller.rejectAdjustment
);

router.post(
  '/:id/cancel',
  requirePermission('inventory.adjust', 'id'),
  controller.cancelAdjustment
);

export { router as stockAdjustmentRoutes };
