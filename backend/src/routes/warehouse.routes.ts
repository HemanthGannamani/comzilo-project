import { Router } from 'express';
import { WarehouseController } from '../controllers/warehouse.controller';
import { WarehouseLocationController } from '../controllers/warehouseLocation.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { warehouseValidation } from '../validations/warehouse.validation';
import { locationValidation } from '../validations/warehouseLocation.validation';

const router = Router();
const controller = new WarehouseController();
const locationController = new WarehouseLocationController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

// Warehouse locations sub-routes under warehouses
router.get(
  '/:warehouseId/locations',
  requirePermission('warehouse_location.read', 'warehouseId'),
  validateRequest({ query: locationValidation.listLocations }),
  locationController.listLocations
);

router.post(
  '/:warehouseId/locations',
  requirePermission('warehouse_location.create', 'warehouseId'),
  validateRequest({ body: locationValidation.createLocation }),
  locationController.createLocation
);

// Warehouse routes
router.get(
  '/',
  requirePermission('warehouse.read'),
  validateRequest({ query: warehouseValidation.listWarehouses }),
  controller.listWarehouses
);

router.post(
  '/',
  requirePermission('warehouse.create'),
  validateRequest({ body: warehouseValidation.createWarehouse }),
  controller.createWarehouse
);

router.get('/:id', requirePermission('warehouse.read', 'id'), controller.getWarehouse);

router.put(
  '/:id',
  requirePermission('warehouse.update', 'id'),
  validateRequest({ body: warehouseValidation.updateWarehouse }),
  controller.updateWarehouse
);

router.delete('/:id', requirePermission('warehouse.delete', 'id'), controller.deleteWarehouse);

router.post(
  '/:id/restore',
  requirePermission('warehouse.restore', 'id'),
  controller.restoreWarehouse
);

router.patch(
  '/:id/default',
  requirePermission('warehouse.set_default', 'id'),
  controller.setDefaultWarehouse
);

export { router as warehouseRoutes };
