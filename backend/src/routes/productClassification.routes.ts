import { Router } from 'express';
import { ProductClassificationController } from '../controllers/productClassification.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { productClassificationValidation } from '../validations/productClassification.validation';

const router = Router();
const controller = new ProductClassificationController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get(
  '/:id/classification',
  requirePermission('product.read', 'id'),
  controller.getClassification
);

router.put(
  '/:id/categories',
  requirePermission('product.manage_categories', 'id'),
  validateRequest({ body: productClassificationValidation.replaceCategories }),
  controller.replaceCategories
);

router.put(
  '/:id/brand',
  requirePermission('product.manage_brand', 'id'),
  validateRequest({ body: productClassificationValidation.assignBrand }),
  controller.assignBrand
);

router.put(
  '/:id/collections',
  requirePermission('product.manage_collections', 'id'),
  validateRequest({ body: productClassificationValidation.replaceCollections }),
  controller.replaceCollections
);

router.put(
  '/:id/tags',
  requirePermission('product.manage_tags', 'id'),
  validateRequest({ body: productClassificationValidation.replaceTags }),
  controller.replaceTags
);

export { router as productClassificationRoutes };
