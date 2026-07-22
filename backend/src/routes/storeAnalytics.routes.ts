import { Router } from 'express';
import { StoreAnalyticsController } from '../controllers/storeAnalytics.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantResolver } from '../middleware/tenantResolver';

const router = Router();

// Apply Auth and Tenant Isolation Middleware
router.use(authenticate);
router.use(tenantResolver);

// Executive Dashboard
router.get('/dashboard', StoreAnalyticsController.getDashboard);

// Domain Analytics
router.get('/sales', StoreAnalyticsController.getSalesAnalytics);
router.get('/inventory', StoreAnalyticsController.getInventoryAnalytics);
router.get('/finance', StoreAnalyticsController.getFinanceAnalytics);
router.get('/customers', StoreAnalyticsController.getCustomerAnalytics);

// Predictive Forecasting
router.get('/forecast', StoreAnalyticsController.getForecast);

// Custom Report Builder & Data Export
router.get('/reports', StoreAnalyticsController.getSavedReports);
router.post('/reports', StoreAnalyticsController.createSavedReport);
router.get('/export', StoreAnalyticsController.exportData);

export default router;
