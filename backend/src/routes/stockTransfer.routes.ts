import { Router } from 'express';
import { StockTransferController } from '../controllers/stockTransfer.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { transferValidation } from '../validations/stockTransfer.validation';

const router = Router();
const controller = new StockTransferController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get(
  '/',
  requirePermission('inventory.read'),
  validateRequest({ query: transferValidation.listTransfers }),
  controller.listTransfers
);

router.post(
  '/',
  requirePermission('inventory.transfer'),
  validateRequest({ body: transferValidation.createTransfer }),
  controller.createTransfer
);

router.get('/:id', requirePermission('inventory.read', 'id'), controller.getTransfer);

router.put(
  '/:id',
  requirePermission('inventory.transfer', 'id'),
  validateRequest({ body: transferValidation.updateTransfer }),
  controller.updateTransfer
);

router.post(
  '/:id/submit',
  requirePermission('inventory.transfer', 'id'),
  controller.submitTransfer
);

router.post(
  '/:id/approve',
  requirePermission('inventory.approve_transfer', 'id'),
  controller.approveTransfer
);

router.post(
  '/:id/reject',
  requirePermission('inventory.approve_transfer', 'id'),
  controller.rejectTransfer
);

router.post(
  '/:id/ship',
  requirePermission('inventory.ship_transfer', 'id'),
  controller.shipTransfer
);

router.post(
  '/:id/receive',
  requirePermission('inventory.receive_transfer', 'id'),
  validateRequest({ body: transferValidation.receiveTransfer }),
  controller.receiveTransfer
);

router.post(
  '/:id/cancel',
  requirePermission('inventory.transfer', 'id'),
  controller.cancelTransfer
);

export { router as stockTransferRoutes };
