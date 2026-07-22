import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { inventoryValidation } from '../validations/inventory.validation';

const router = Router();
const controller = new InventoryController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.post(
  '/stock-in',
  requirePermission('inventory.stock_in'),
  validateRequest({ body: inventoryValidation.stockIn }),
  controller.recordStockIn
);

router.post(
  '/stock-out',
  requirePermission('inventory.stock_out'),
  validateRequest({ body: inventoryValidation.stockOut }),
  controller.recordStockOut
);

router.get(
  '/',
  requirePermission('inventory.view_movements'),
  validateRequest({ query: inventoryValidation.listMovements }),
  controller.listMovements
);

router.get('/:id', requirePermission('inventory.view_movements', 'id'), controller.getMovement);

export { router as stockMovementRoutes };
