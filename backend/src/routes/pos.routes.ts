import { Router } from 'express';
import { POSController } from '../controllers/pos.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { posValidation } from '../validations/pos.validation';

const router = Router();
const controller = new POSController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.post(
  '/register/open',
  requirePermission('pos.register.open'),
  validateRequest({ body: posValidation.openRegister }),
  controller.openRegister
);

router.post(
  '/register/close',
  requirePermission('pos.register.close'),
  validateRequest({ body: posValidation.closeRegister }),
  controller.closeRegister
);

router.get('/registers', requirePermission('pos.read'), controller.listRegisters);
router.get('/sessions', requirePermission('pos.session.read'), controller.listSessions);

router.post(
  '/sales',
  requirePermission('pos.sale'),
  validateRequest({ body: posValidation.createPOSSale }),
  controller.createPOSSale
);

router.post(
  '/returns',
  requirePermission('pos.return'),
  validateRequest({ body: posValidation.createPOSReturn }),
  controller.createPOSReturn
);

export default router;
export { router as posRoutes };
