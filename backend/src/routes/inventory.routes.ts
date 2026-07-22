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

// Stock movements (Place these at the top or register separately, but the prompt says they are under stock-movements path)
// Actually, stock-movements can be in this file if they are registered with '/api/v1/stock-movements' in app.ts, OR we can register them as sub-routes here.
// Let's create a separate route file for stockMovements, stockAdjustments, stockTransfers, and stockReservations to keep it modular!
// Wait! If we register them separately in app.ts, it is extremely clean!
// Yes:
// - app.use('/api/v1/inventory', inventoryRoutes);
// - app.use('/api/v1/stock-movements', stockMovementRoutes);
// - app.use('/api/v1/stock-adjustments', stockAdjustmentRoutes);
// - app.use('/api/v1/stock-transfers', stockTransferRoutes);
// - app.use('/api/v1/stock-reservations', stockReservationRoutes);
// This is perfect! Let's implement inventoryRoutes first.

router.get(
  '/low-stock',
  requirePermission('inventory.read'),
  validateRequest({ query: inventoryValidation.listLowStock }),
  controller.listLowStock
);

router.get(
  '/product/:productId',
  requirePermission('inventory.read', 'productId'),
  controller.getProductInventory
);

router.get('/', requirePermission('inventory.read'), controller.listBalances);

router.get('/:id', requirePermission('inventory.read', 'id'), controller.getBalance);

router.put(
  '/:id/reorder-settings',
  requirePermission('inventory.update_reorder_settings', 'id'),
  validateRequest({ body: inventoryValidation.updateReorderSettings }),
  controller.updateReorderSettings
);

export { router as inventoryRoutes };
