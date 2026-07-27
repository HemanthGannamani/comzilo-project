import { Router } from 'express';
import { MarketingController } from '../controllers/marketing.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const controller = new MarketingController();

// Marketing Dashboard & Analytics
router.get('/dashboard', authenticate, controller.getDashboardStats);

// Email Providers & Templates
router.get('/email-providers', authenticate, controller.getEmailProviders);
router.post('/email-providers', authenticate, controller.saveEmailProvider);
router.post('/email-providers/test-connection', authenticate, controller.testSmtpConnection);
router.post('/email-providers/send-test-email', authenticate, controller.sendTestEmail);

router.get('/email-templates', authenticate, controller.getEmailTemplates);
router.post('/email-templates', authenticate, controller.createEmailTemplate);
router.post('/email-templates/ai-generate', authenticate, controller.generateAiEmailContent);

// Email Logs & Queue Engine
router.get('/email-logs', authenticate, controller.getEmailLogs);
router.get('/email-queue', authenticate, controller.getEmailQueue);
router.post('/queue/enqueue-cart-abandonment', authenticate, controller.enqueueCartAbandonment);
router.post('/queue/process-now', authenticate, controller.processQueueNow);

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

// Marketing Analytics
router.get('/analytics', authenticate, controller.getMarketingAnalytics);

// WhatsApp Automation & Settings
router.get('/whatsapp-settings', authenticate, controller.getWhatsAppSettings);
router.post('/whatsapp-settings', authenticate, controller.saveWhatsAppSettings);
router.post('/whatsapp/test-connection', authenticate, controller.testWhatsAppConnection);
router.post('/whatsapp/send-test-message', authenticate, controller.sendWhatsAppTestMessage);
router.get('/whatsapp-templates', authenticate, controller.getWhatsAppTemplates);
router.post('/whatsapp-templates', authenticate, controller.createWhatsAppTemplate);

// Customer Communication Center
router.get('/communication-logs', authenticate, controller.getCommunicationLogs);

export default router;
