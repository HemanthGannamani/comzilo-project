import express from 'express';
import { AdminDashboardController } from '../controllers/adminDashboard.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';

const router = express.Router();
const controller = new AdminDashboardController();

router.use(tenantResolver);
router.use(authenticate);
router.use(authorize);

router.get('/dashboard', requirePermission('tenant.read'), controller.getDashboardMetrics);
router.get('/reports/sellers', requirePermission('tenant.read'), controller.getSellersReport);
router.get(
  '/reports/applications',
  requirePermission('tenant.read'),
  controller.getApplicationsReport
);
router.get('/reports/tenants', requirePermission('tenant.read'), controller.getTenantsReport);
router.get('/reports/stores', requirePermission('tenant.read'), controller.getStoresReport);

export default router;
