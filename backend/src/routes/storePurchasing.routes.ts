import { Router } from 'express';
import { StorePurchasingController } from '../controllers/storePurchasing.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantResolver } from '../middleware/tenantResolver';

const router = Router();

// Apply Auth and Tenant Isolation Middleware
router.use(authenticate);
router.use(tenantResolver);

// Suppliers
router.get('/suppliers', StorePurchasingController.getSuppliers);
router.post('/suppliers', StorePurchasingController.createSupplier);

// Purchase Requests
router.get('/requests', StorePurchasingController.getRequests);
router.post('/requests', StorePurchasingController.createRequest);

// Purchase Orders (PO)
router.get('/orders', StorePurchasingController.getOrders);
router.post('/orders', StorePurchasingController.createOrder);

// Goods Receipt Notes (GRN)
router.get('/grn', StorePurchasingController.getGoodsReceipts);
router.post('/grn', StorePurchasingController.createGoodsReceipt);

// Supplier Returns
router.post('/returns', StorePurchasingController.processReturn);

// Invoices & Payments
router.get('/invoices', StorePurchasingController.getInvoices);
router.post('/invoices', StorePurchasingController.createInvoice);
router.post('/payments/pay', StorePurchasingController.payInvoice);

export default router;
