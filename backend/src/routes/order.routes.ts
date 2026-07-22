import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { orderValidation } from '../validations/order.validation';

const router = Router();
const controller = new OrderController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get(
  '/',
  requirePermission('order.read'),
  validateRequest({ query: orderValidation.listOrders }),
  controller.listOrders
);

router.post(
  '/',
  requirePermission('order.create'),
  validateRequest({ body: orderValidation.createOrder }),
  controller.createOrder
);

router.get('/:id', requirePermission('order.read', 'id'), controller.getOrder);

router.put(
  '/:id',
  requirePermission('order.update', 'id'),
  validateRequest({ body: orderValidation.updateOrder }),
  controller.updateOrder
);

router.delete('/:id', requirePermission('order.delete', 'id'), controller.deleteOrder);

router.post('/:id/confirm', requirePermission('order.confirm', 'id'), controller.confirmOrder);
router.post('/:id/cancel', requirePermission('order.cancel', 'id'), controller.cancelOrder);
router.post('/:id/complete', requirePermission('order.complete', 'id'), controller.completeOrder);
router.post('/:id/restore', requirePermission('order.restore', 'id'), controller.restoreOrder);

export default router;
