import express from 'express';
import { TenantController } from '../controllers/tenant.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate } from '../middleware/validate';
import {
  createTenantSchema,
  updateTenantSchema,
  assignPlanSchema,
} from '../validations/tenant.validation';

const router = express.Router();
const controller = new TenantController();

router.use(tenantResolver);
router.use(authenticate);
router.use(authorize);

router.get('/', requirePermission('tenant.read'), controller.listTenants);

router.post(
  '/',
  requirePermission('tenant.create'),
  validate(createTenantSchema),
  controller.createTenant
);

router.get('/:id', requirePermission('tenant.read'), controller.getTenant);

router.put(
  '/:id',
  requirePermission('tenant.update'),
  validate(updateTenantSchema),
  controller.updateTenant
);

router.delete('/:id', requirePermission('tenant.delete'), controller.deleteTenant);

router.post('/:id/restore', requirePermission('tenant.delete'), controller.restoreTenant);

router.post(
  '/:id/subscription',
  requirePermission('tenant.update'),
  validate(assignPlanSchema),
  controller.assignPlan
);

router.get('/:id/statistics', requirePermission('tenant.read'), controller.getStatistics);

export default router;
