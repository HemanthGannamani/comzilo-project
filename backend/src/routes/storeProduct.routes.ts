import express from 'express';
import { StoreProductController } from '../controllers/storeProduct.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authz.middleware';

const router = express.Router();

router.use(tenantResolver);
router.use(authenticate);
router.use(authorize);

router.get('/', StoreProductController.getProducts);
router.get('/:id', StoreProductController.getProductById);
router.post('/', StoreProductController.createProduct);
router.patch('/:id', StoreProductController.updateProduct);
router.delete('/:id', StoreProductController.deleteProduct);
router.post('/bulk-action', StoreProductController.bulkAction);

export default router;
