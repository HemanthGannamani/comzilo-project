import { Router } from 'express';
import { TenantSettingsController } from '../controllers/tenantSettings.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { settingsValidation } from '../validations/settings.validation';

const router = Router();
const controller = new TenantSettingsController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get('/', requirePermission('settings.tenant.read'), controller.getSettings);

router.put(
  '/',
  requirePermission('settings.tenant.update'),
  validateRequest({ body: settingsValidation.updateTenantSettings }),
  controller.updateBulkSettings
);

router.put(
  '/single',
  requirePermission('settings.tenant.update'),
  validateRequest({ body: settingsValidation.updateTenantSettingSingle }),
  controller.updateSingleSetting
);

export default router;
export { router as tenantSettingsRoutes };
