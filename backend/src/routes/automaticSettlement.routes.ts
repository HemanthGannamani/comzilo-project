import { Router } from 'express';
import { AutomaticSettlementController } from '../controllers/automaticSettlement.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantResolver } from '../middleware/tenantResolver';

const router = Router();
const controller = new AutomaticSettlementController();

router.use(tenantResolver);
router.post('/process-eligible', controller.processEligibleSettlements);
router.get('/', controller.getSettlements);
router.get('/reports', controller.getSettlementReports);

export default router;
