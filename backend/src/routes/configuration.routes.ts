import { Router } from 'express';
import { ConfigurationController } from '../controllers/configuration.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { settingsValidation } from '../validations/settings.validation';

const router = Router();
const controller = new ConfigurationController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get('/', requirePermission('configuration.read'), controller.getGlobalConfiguration);

router.put(
  '/',
  requirePermission('configuration.update'),
  validateRequest({ body: settingsValidation.updateGlobalConfig }),
  controller.updateGlobalSetting
);

router.get('/feature-flags', requirePermission('configuration.read'), controller.getFeatureFlags);

router.put(
  '/feature-flags',
  requirePermission('configuration.update'),
  validateRequest({ body: settingsValidation.updateFeatureFlags }),
  controller.updateFeatureFlags
);

router.get(
  '/history',
  requirePermission('settings.global.read'),
  validateRequest({ query: settingsValidation.getHistory }),
  controller.getHistory
);

export default router;
export { router as configurationRoutes };
