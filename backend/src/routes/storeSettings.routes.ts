import { Router } from 'express';
import { StoreSettingsController } from '../controllers/storeSettings.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { settingsValidation } from '../validations/settings.validation';

const router = Router();
const controller = new StoreSettingsController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get('/', requirePermission('settings.store.read'), controller.getSettings);

router.get('/:storeId', requirePermission('settings.store.read'), controller.getSettings);

router.put(
  '/',
  requirePermission('settings.store.update'),
  validateRequest({ body: settingsValidation.updateStoreSettings }),
  controller.updateBulkSettings
);

router.put(
  '/:storeId',
  requirePermission('settings.store.update'),
  validateRequest({ body: settingsValidation.updateStoreSettings }),
  controller.updateBulkSettings
);

router.put(
  '/single/key',
  requirePermission('settings.store.update'),
  validateRequest({ body: settingsValidation.updateStoreSettingSingle }),
  controller.updateSingleSetting
);

export default router;
export { router as storeSettingsRoutes };
