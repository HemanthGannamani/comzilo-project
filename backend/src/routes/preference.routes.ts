import { Router } from 'express';
import { PreferenceController } from '../controllers/preference.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { notificationValidation } from '../validations/notification.validation';

const router = Router();
const controller = new PreferenceController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get('/', requirePermission('notification.preference.read'), controller.getPreferences);

router.put(
  '/',
  requirePermission('notification.preference.update'),
  validateRequest({ body: notificationValidation.updatePreferences }),
  controller.updatePreferences
);

export default router;
export { router as preferenceRoutes };
