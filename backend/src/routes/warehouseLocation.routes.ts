import { Router } from 'express';
import { WarehouseLocationController } from '../controllers/warehouseLocation.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { locationValidation } from '../validations/warehouseLocation.validation';

const router = Router();
const controller = new WarehouseLocationController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get('/:id', requirePermission('warehouse_location.read', 'id'), controller.getLocation);

router.put(
  '/:id',
  requirePermission('warehouse_location.update', 'id'),
  validateRequest({ body: locationValidation.updateLocation }),
  controller.updateLocation
);

router.delete(
  '/:id',
  requirePermission('warehouse_location.delete', 'id'),
  controller.deleteLocation
);

router.post(
  '/:id/restore',
  requirePermission('warehouse_location.restore', 'id'),
  controller.restoreLocation
);

router.patch(
  '/:id/default',
  requirePermission('warehouse_location.set_default', 'id'),
  controller.setDefaultLocation
);

export { router as warehouseLocationRoutes };
