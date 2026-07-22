import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { notificationValidation } from '../validations/notification.validation';

const router = Router();
const controller = new NotificationController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.post(
  '/send',
  requirePermission('notification.send'),
  validateRequest({ body: notificationValidation.sendNotification }),
  controller.sendNotification
);

router.get(
  '/',
  requirePermission('notification.read'),
  validateRequest({ query: notificationValidation.listNotifications }),
  controller.listInAppNotifications
);

router.get('/unread-count', requirePermission('notification.read'), controller.getUnreadCount);

router.patch('/mark-all-read', requirePermission('notification.update'), controller.markAllAsRead);

router.patch('/:id/read', requirePermission('notification.update'), controller.markAsRead);

router.delete('/:id', requirePermission('notification.delete'), controller.deleteNotification);

export default router;
export { router as notificationRoutes };
