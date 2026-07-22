import { Router } from 'express';
import { StockReservationController } from '../controllers/stockReservation.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { reservationValidation } from '../validations/stockReservation.validation';

const router = Router();
const controller = new StockReservationController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get(
  '/',
  requirePermission('inventory.read'),
  validateRequest({ query: reservationValidation.listReservations }),
  controller.listReservations
);

router.post(
  '/',
  requirePermission('inventory.reserve'),
  validateRequest({ body: reservationValidation.createReservation }),
  controller.createReservation
);

router.get('/:id', requirePermission('inventory.read', 'id'), controller.getReservation);

router.post(
  '/:id/release',
  requirePermission('inventory.release_reservation', 'id'),
  controller.releaseReservation
);

router.post(
  '/:id/fulfill',
  requirePermission('inventory.fulfill_reservation', 'id'),
  controller.fulfillReservation
);

router.post(
  '/:id/cancel',
  requirePermission('inventory.release_reservation', 'id'),
  controller.cancelReservation
);

export { router as stockReservationRoutes };
