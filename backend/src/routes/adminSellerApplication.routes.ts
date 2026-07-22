import express from 'express';
import { AdminSellerApplicationController } from '../controllers/adminSellerApplication.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';

const router = express.Router();
const controller = new AdminSellerApplicationController();

// Admin Panel protection hooks
router.use(tenantResolver);
router.use(authenticate);
router.use(authorize);

router.get('/', requirePermission('tenant.read'), controller.listApplications);
router.get('/:id', requirePermission('tenant.read'), controller.getApplication);
router.patch('/:id/approve', requirePermission('tenant.update'), controller.approveApplication);
router.patch('/:id/reject', requirePermission('tenant.update'), controller.rejectApplication);

export default router;
