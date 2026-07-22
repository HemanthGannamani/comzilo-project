import { Router } from 'express';
import { TagController } from '../controllers/tag.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { tagValidation } from '../validations/tag.validation';

const router = Router();
const controller = new TagController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get(
  '/',
  requirePermission('tag.read'),
  validateRequest({ query: tagValidation.listTags }),
  controller.listTags
);

router.post(
  '/',
  requirePermission('tag.create'),
  validateRequest({ body: tagValidation.createTag }),
  controller.createTag
);

router.get('/:id', requirePermission('tag.read', 'id'), controller.getTag);

router.put(
  '/:id',
  requirePermission('tag.update', 'id'),
  validateRequest({ body: tagValidation.updateTag }),
  controller.updateTag
);

router.delete('/:id', requirePermission('tag.delete', 'id'), controller.deleteTag);

router.post('/:id/restore', requirePermission('tag.restore', 'id'), controller.restoreTag);

export { router as tagRoutes };
