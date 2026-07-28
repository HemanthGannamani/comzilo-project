import { Router } from 'express';
import { SupportCenterController } from '../controllers/supportCenter.controller';

const router = Router();

// Customer Support Endpoints
router.post('/customer/ai-chat', SupportCenterController.customerAiChat);
router.get('/customer/tickets', SupportCenterController.getCustomerTickets);
router.get('/customer/tickets/:id', SupportCenterController.getCustomerTicketDetails);
router.post('/customer/tickets', SupportCenterController.createCustomerTicket);
router.post('/customer/tickets/:id/reply', SupportCenterController.addCustomerReply);
router.post('/customer/tickets/:id/rate', SupportCenterController.rateCustomerTicket);

// Seller Support Endpoints
router.get('/seller/tickets', SupportCenterController.getSellerTickets);
router.get('/seller/tickets/:id', SupportCenterController.getSellerTicketDetails);
router.post('/seller/tickets/:id/reply', SupportCenterController.sellerReplyTicket);
router.post('/seller/tickets/:id/internal-note', SupportCenterController.addInternalNote);
router.patch('/seller/tickets/:id', SupportCenterController.updateTicketStatusPriority);
router.get('/seller/analytics', SupportCenterController.getSellerSupportAnalytics);
router.get('/seller/canned-responses', SupportCenterController.getCannedResponses);
router.post('/seller/canned-responses', SupportCenterController.createCannedResponse);

// Super Admin Platform Metrics (Strict Isolation: Analytics ONLY, NO ticket text)
router.get('/admin/analytics', SupportCenterController.getSuperAdminSupportAnalytics);

export default router;
