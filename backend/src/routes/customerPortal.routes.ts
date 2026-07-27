import { Router } from 'express';
import { CustomerPortalController } from '../controllers/customerPortal.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';

const router = Router();
const controller = new CustomerPortalController();

router.use(tenantResolver);
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

export default router;
