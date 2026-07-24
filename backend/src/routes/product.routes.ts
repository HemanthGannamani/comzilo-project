import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { productValidation } from '../validations/product.validation';

const router = Router();
const controller = new ProductController();

// All product routes require tenant context, authentication, and authorization resolution
router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get('/types', controller.getProductTypes);

router.get(
  '/',
  requirePermission('product.read'),
  validateRequest({ query: productValidation.listProducts }),
  controller.listProducts
);

router.post(
  '/',
  requirePermission('product.create'),
  validateRequest({ body: productValidation.createProduct }),
  controller.createProduct
);

router.get('/:id', requirePermission('product.read', 'id'), controller.getProduct);

router.put(
  '/:id',
  requirePermission('product.update', 'id'),
  validateRequest({ body: productValidation.updateProduct }),
  controller.updateProduct
);

router.delete('/:id', requirePermission('product.delete', 'id'), controller.deleteProduct);

router.post(
  '/:id/restore',
  requirePermission('product.delete', 'id'), // Often restore uses same permission as delete
  controller.restoreProduct
);

export { router as productRoutes };
