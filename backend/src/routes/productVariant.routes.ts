import express from 'express';
import { ProductVariantController } from '../controllers/productVariant.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();
const controller = new ProductVariantController();

router.use(tenantResolver);

router.get('/products/:productId/variants', controller.getVariantsByProduct);
router.get('/variants/:id', controller.getVariantById);

router.use(authenticate);

router.post('/variants', controller.createVariant);
router.put('/variants/:id', controller.updateVariant);
router.delete('/variants/:id', controller.deleteVariant);

export default router;
