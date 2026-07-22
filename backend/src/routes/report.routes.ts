import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { reportValidation } from '../validations/report.validation';

const router = Router();
const controller = new ReportController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get('/dashboard', requirePermission('dashboard.read'), controller.getDashboard);

router.get(
  '/sales',
  requirePermission('report.read'),
  validateRequest({ query: reportValidation.getSalesReport }),
  controller.getSalesReport
);

router.get(
  '/products',
  requirePermission('report.read'),
  validateRequest({ query: reportValidation.getProductReport }),
  controller.getProductReport
);

router.get(
  '/inventory',
  requirePermission('report.read'),
  validateRequest({ query: reportValidation.getInventoryReport }),
  controller.getInventoryReport
);

router.get(
  '/customers',
  requirePermission('report.read'),
  validateRequest({ query: reportValidation.getCustomerReport }),
  controller.getCustomerReport
);

router.get(
  '/payments',
  requirePermission('report.read'),
  validateRequest({ query: reportValidation.getPaymentReport }),
  controller.getPaymentReport
);

router.get(
  '/pos',
  requirePermission('report.read'),
  validateRequest({ query: reportValidation.getPOSReport }),
  controller.getPOSReport
);

router.get(
  '/export/csv',
  requirePermission('export.csv'),
  validateRequest({ query: reportValidation.exportCSV }),
  controller.exportCSV
);

export default router;
export { router as reportRoutes };
