import { Router } from 'express';
import { CustomerPortalController } from '../controllers/customerPortal.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';

const router = Router();
const controller = new CustomerPortalController();

router.use(tenantResolver);

// Public Endpoints (No JWT Auth Required)
router.post('/webhooks/razorpay', controller.handleRazorpayWebhook);
router.post('/newsletter/subscribe', controller.subscribeNewsletter);

router.use(requireAuth);

// Customer Account Portal APIs
router.get('/dashboard', controller.getDashboard);

router.get('/profile', controller.getProfile);
router.put('/profile', controller.updateProfile);

router.get('/orders', controller.listMyOrders);
router.get('/orders/:id', controller.getMyOrderDetails);
router.post('/orders/:id/cancel', controller.cancelMyOrder);

router.get('/addresses', controller.listMyAddresses);
router.post('/addresses', controller.createMyAddress);
router.put('/addresses/:id', controller.updateMyAddress);
router.delete('/addresses/:id', controller.deleteMyAddress);
router.patch('/addresses/:id/default', controller.setDefaultAddress);

router.get('/invoices', controller.listMyInvoices);
router.get('/payments', controller.listMyPayments);

router.post('/change-password', controller.changePassword);

router.post('/validate-coupon', controller.validateCoupon);
router.post('/place-order', controller.placeOrder);

// Razorpay Payment Integration Endpoints
router.post('/create-razorpay-order', controller.createRazorpayOrder);
router.post('/verify-razorpay-payment', controller.verifyRazorpayPayment);

export default router;
