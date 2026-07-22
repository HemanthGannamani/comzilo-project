import express from 'express';
import { AdminSystemController } from '../controllers/adminSystem.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';

const router = express.Router();
const controller = new AdminSystemController();

router.use(tenantResolver);
router.use(authenticate);
router.use(authorize);

// System Settings
router.get('/settings', requirePermission('tenant.read'), controller.getSystemSettings);
router.post('/settings', requirePermission('tenant.update'), controller.saveSystemSettings);

// Email Templates
router.get('/email-templates', requirePermission('tenant.read'), controller.getEmailTemplates);
router.post('/email-templates', requirePermission('tenant.update'), controller.saveEmailTemplate);

// In-App Notification Center
router.get('/notifications', requirePermission('tenant.read'), controller.getNotifications);
router.patch(
  '/notifications/:id/read',
  requirePermission('tenant.update'),
  controller.markNotificationRead
);
router.patch(
  '/notifications/:id/unread',
  requirePermission('tenant.update'),
  controller.markNotificationUnread
);

// System Health & Environment
router.get('/system-health', requirePermission('tenant.read'), controller.getSystemHealth);

// Backup Management
router.get('/backups', requirePermission('tenant.read'), controller.listBackups);
router.post('/backups', requirePermission('tenant.update'), controller.createBackup);
router.get('/backups/:filename', requirePermission('tenant.read'), controller.downloadBackup);
router.delete('/backups/:filename', requirePermission('tenant.update'), controller.deleteBackup);
router.post(
  '/backups/:filename/restore',
  requirePermission('tenant.update'),
  controller.restoreBackup
);

// Audit Logs Viewer
router.get('/audit-logs', requirePermission('tenant.read'), controller.getAuditLogs);

export default router;
