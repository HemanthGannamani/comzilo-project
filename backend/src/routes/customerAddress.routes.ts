import { Router } from 'express';
import { CustomerAddressController } from '../controllers/customerAddress.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { customerValidation } from '../validations/customer.validation';

const router = Router();
const controller = new CustomerAddressController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.put(
  '/:id',
  requirePermission('customer.address.update', 'id'),
  validateRequest({ body: customerValidation.updateAddress }),
  controller.updateAddress
);
router.delete('/:id', requirePermission('customer.address.delete', 'id'), controller.deleteAddress);
router.post(
  '/:id/restore',
  requirePermission('customer.address.restore', 'id'),
  controller.restoreAddress
);
router.patch(
  '/:id/default-billing',
  requirePermission('customer.address.update', 'id'),
  controller.setDefaultBilling
);
router.patch(
  '/:id/default-shipping',
  requirePermission('customer.address.update', 'id'),
  controller.setDefaultShipping
);

export default router;
