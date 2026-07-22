import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { integrationValidation } from '../validations/integration.validation';

const router = Router();
const controller = new WebhookController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.post(
  '/',
  requirePermission('webhook.create'),
  validateRequest({ body: integrationValidation.createEndpoint }),
  controller.createEndpoint
);

router.get('/', requirePermission('webhook.read'), controller.listEndpoints);

router.get('/:id', requirePermission('webhook.read'), controller.getEndpoint);

router.put(
  '/:id',
  requirePermission('webhook.update'),
  validateRequest({ body: integrationValidation.updateEndpoint }),
  controller.updateEndpoint
);

router.delete('/:id', requirePermission('webhook.delete'), controller.deleteEndpoint);

router.post(
  '/trigger',
  requirePermission('webhook.trigger'),
  validateRequest({ body: integrationValidation.triggerWebhook }),
  controller.triggerEvent
);

router.get('/:id/logs', requirePermission('webhook.read'), controller.listLogs);

export default router;
export { router as webhookRoutes };
