import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';

const router = Router();
const controller = new SettingsController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get('/', requirePermission('settings.read'), controller.getResolvedSettings);

router.get('/:key', requirePermission('settings.read'), controller.resolveSingleKey);

export default router;
export { router as settingsRoutes };
