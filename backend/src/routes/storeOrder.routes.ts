import { Router } from 'express';
import { StoreOrderController } from '../controllers/storeOrder.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantResolver } from '../middleware/tenantResolver';

const router = Router();

// Apply Auth and Tenant Isolation Middleware
router.use(authenticate);
router.use(tenantResolver);

// Orders List & Details
router.get('/', StoreOrderController.getOrders);
router.post('/', StoreOrderController.createOrder);
router.get('/:id', StoreOrderController.getOrderById);
router.patch('/:id/status', StoreOrderController.updateOrderStatus);

// Sub-resources: Payments, Invoices, Shipments, Returns, Refunds
router.post('/:id/payments', StoreOrderController.recordPayment);
router.post('/:id/invoices', StoreOrderController.generateInvoice);
router.post('/:id/shipments', StoreOrderController.createShipment);
router.post('/:id/returns', StoreOrderController.requestReturn);
router.post('/:id/refunds', StoreOrderController.issueRefund);

export default router;
