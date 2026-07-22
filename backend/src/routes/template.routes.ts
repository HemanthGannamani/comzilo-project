import { Router } from 'express';
import { TemplateController } from '../controllers/template.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { notificationValidation } from '../validations/notification.validation';

const router = Router();
const controller = new TemplateController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.post(
  '/',
  requirePermission('notification.template.create'),
  validateRequest({ body: notificationValidation.createTemplate }),
  controller.createTemplate
);

router.get('/', requirePermission('notification.template.read'), controller.listTemplates);

router.get('/:id', requirePermission('notification.template.read'), controller.getTemplate);

router.put(
  '/:id',
  requirePermission('notification.template.update'),
  validateRequest({ body: notificationValidation.updateTemplate }),
  controller.updateTemplate
);

export default router;
export { router as templateRoutes };
