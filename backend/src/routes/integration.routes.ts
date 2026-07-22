import { Router } from 'express';
import { IntegrationController } from '../controllers/integration.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { integrationValidation } from '../validations/integration.validation';

const router = Router();
const controller = new IntegrationController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get('/marketplace', requirePermission('marketplace.read'), controller.getMarketplaceApps);

router.post(
  '/',
  requirePermission('integration.connect'),
  validateRequest({ body: integrationValidation.connectIntegration }),
  controller.connectIntegration
);

router.get('/', requirePermission('integration.read'), controller.listIntegrations);

router.get('/:id', requirePermission('integration.read'), controller.getIntegration);

router.put(
  '/:id',
  requirePermission('integration.update'),
  validateRequest({ body: integrationValidation.updateIntegration }),
  controller.updateIntegration
);

router.post(
  '/:id/disconnect',
  requirePermission('integration.disconnect'),
  controller.disconnectIntegration
);

router.post(
  '/:id/sync',
  requirePermission('integration.sync'),
  validateRequest({ body: integrationValidation.triggerSync }),
  controller.triggerSync
);

router.get('/:id/logs', requirePermission('integration.log.read'), controller.listSyncLogs);

export default router;
export { router as integrationRoutes };
