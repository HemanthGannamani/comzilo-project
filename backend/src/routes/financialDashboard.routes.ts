import { Router } from 'express';
import { FinancialDashboardController } from '../controllers/financialDashboard.controller';

const router = Router();
const controller = new FinancialDashboardController();

router.get('/dashboard', controller.getFinancialOverview);
router.get('/gateway-logs', controller.getGatewayLogs);
router.get('/webhook-logs', controller.getWebhookLogs);
router.get('/payout-logs', controller.getPayoutLogs);
router.get('/export', controller.exportFinancialData);

export default router;
