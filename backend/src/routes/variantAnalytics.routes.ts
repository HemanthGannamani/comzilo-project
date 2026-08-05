import { Router } from 'express';
import { VariantAnalyticsController } from '../controllers/variantAnalytics.controller';

const router = Router();
const controller = new VariantAnalyticsController();

router.get('/summary', (req, res, next) => controller.getSummary(req, res, next));
router.get('/top-sellers', (req, res, next) => controller.getTopSellers(req, res, next));
router.get('/inventory', (req, res, next) => controller.getInventoryReport(req, res, next));
router.get('/attributes', (req, res, next) => controller.getAttributePerformance(req, res, next));
router.get('/export', (req, res, next) => controller.exportCSV(req, res, next));

export default router;
