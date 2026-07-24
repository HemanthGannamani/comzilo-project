import { Router } from 'express';
import { MarketingController } from '../controllers/marketing.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const controller = new MarketingController();

// Marketing Dashboard & Analytics
router.get('/dashboard', authenticate, controller.getDashboardStats);

// Email Providers & Templates
router.get('/email-providers', authenticate, controller.getEmailProviders);
router.get('/email-templates', authenticate, controller.getEmailTemplates);
router.post('/email-templates', authenticate, controller.createEmailTemplate);

// Campaigns
router.get('/campaigns', authenticate, controller.getCampaigns);
router.post('/campaigns', authenticate, controller.createCampaign);

// Coupons
router.get('/coupons', authenticate, controller.getCoupons);
router.post('/coupons', authenticate, controller.createCoupon);

// Abandoned Carts
router.get('/abandoned-carts', authenticate, controller.getAbandonedCarts);
router.get('/abandoned-cart', authenticate, controller.getAbandonedCarts);

// Customer Segments
router.get('/segments', authenticate, controller.getCustomerSegments);
router.get('/customer-segments', authenticate, controller.getCustomerSegments);
router.post('/segments', authenticate, controller.createCustomerSegment);
router.post('/customer-segments', authenticate, controller.createCustomerSegment);

// Automation Rules
router.get('/automation-rules', authenticate, controller.getAutomationRules);
router.post('/automation-rules', authenticate, controller.createAutomationRule);

export default router;
