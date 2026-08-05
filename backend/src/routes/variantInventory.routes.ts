import express from 'express';
import { VariantInventoryController } from '../controllers/variantInventory.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();
const controller = new VariantInventoryController();

router.use(tenantResolver);
router.use(authenticate);

router.get('/variant-inventory/:variantId', controller.getVariantInventories);
router.post('/variant-inventory/allocate', controller.allocateWarehouse);
router.post('/variant-inventory/adjust', controller.adjustStock);
router.post('/variant-inventory/transfer', controller.transferStock);
router.post('/variant-inventory/bulk-update', controller.bulkUpdateInventory);

export default router;
