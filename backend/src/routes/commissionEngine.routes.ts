import { Router } from 'express';
import { CommissionEngineController } from '../controllers/commissionEngine.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantResolver } from '../middleware/tenantResolver';

const router = Router();
const controller = new CommissionEngineController();

router.use(tenantResolver);
router.post('/calculate', controller.calculatePayout);

router.use(authenticate);

router.get('/config', controller.getCommissionConfig);
router.put('/config', controller.updateCommissionConfig);
router.get('/breakdown/:orderId', controller.getOrderCommissionBreakdown);
router.get('/reports', controller.getCommissionReport);

export default router;
