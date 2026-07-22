import { Router } from 'express';
import { BrandController } from '../controllers/brand.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { brandValidation } from '../validations/brand.validation';

const router = Router();
const controller = new BrandController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get(
  '/',
  requirePermission('brand.read'),
  validateRequest({ query: brandValidation.listBrands }),
  controller.listBrands
);

router.post(
  '/',
  requirePermission('brand.create'),
  validateRequest({ body: brandValidation.createBrand }),
  controller.createBrand
);

router.get('/:id', requirePermission('brand.read', 'id'), controller.getBrand);

router.put(
  '/:id',
  requirePermission('brand.update', 'id'),
  validateRequest({ body: brandValidation.updateBrand }),
  controller.updateBrand
);

router.delete('/:id', requirePermission('brand.delete', 'id'), controller.deleteBrand);

router.post('/:id/restore', requirePermission('brand.restore', 'id'), controller.restoreBrand);

export { router as brandRoutes };
