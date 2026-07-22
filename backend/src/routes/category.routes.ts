import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { categoryValidation } from '../validations/category.validation';

const router = Router();
const controller = new CategoryController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get(
  '/',
  requirePermission('category.read'),
  validateRequest({ query: categoryValidation.listCategories }),
  controller.listCategories
);

router.post(
  '/',
  requirePermission('category.create'),
  validateRequest({ body: categoryValidation.createCategory }),
  controller.createCategory
);

router.get('/tree', requirePermission('category.read'), controller.getCategoryTree);

// Define reorder before standard :id param to avoid clash
router.patch(
  '/reorder',
  requirePermission('category.update'),
  validateRequest({ body: categoryValidation.reorderCategories }),
  controller.reorderCategories
);

router.get('/:id', requirePermission('category.read', 'id'), controller.getCategory);

router.put(
  '/:id',
  requirePermission('category.update', 'id'),
  validateRequest({ body: categoryValidation.updateCategory }),
  controller.updateCategory
);

router.delete('/:id', requirePermission('category.delete', 'id'), controller.deleteCategory);

router.post(
  '/:id/restore',
  requirePermission('category.restore', 'id'),
  controller.restoreCategory
);

router.patch(
  '/:id/move',
  requirePermission('category.update', 'id'),
  validateRequest({ body: categoryValidation.moveCategory }),
  controller.moveCategory
);

export { router as categoryRoutes };
