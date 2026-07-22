import express from 'express';
import { AdminSellerController } from '../controllers/adminSeller.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';

const router = express.Router();
const controller = new AdminSellerController();

// Admin Protection hooks
router.use(tenantResolver);
router.use(authenticate);
router.use(authorize);

router.get('/', requirePermission('tenant.read'), controller.listSellers);
router.get('/:id', requirePermission('tenant.read'), controller.getSeller);
router.post('/', requirePermission('tenant.update'), controller.createSeller);
router.patch('/:id', requirePermission('tenant.update'), controller.updateSeller);
router.patch('/:id/status', requirePermission('tenant.update'), controller.updateSellerStatus);
router.delete('/:id', requirePermission('tenant.update'), controller.deleteSeller);

export default router;
