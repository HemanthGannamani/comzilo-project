import express from 'express';
import { StoreInventoryManagementController } from '../controllers/storeInventoryManagement.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';

const router = express.Router();
const controller = new StoreInventoryManagementController();

router.use(tenantResolver);
router.use(authenticate);
router.use(authorize);

router.get('/dashboard', requirePermission('inventory.read'), controller.getDashboard);
router.get('/warehouses', requirePermission('warehouse.read'), controller.getWarehouses);
router.post('/warehouses', requirePermission('warehouse.manage'), controller.createWarehouse);
router.get('/locations', requirePermission('warehouse.read'), controller.getLocations);
router.post('/locations', requirePermission('warehouse.manage'), controller.createLocation);

router.get('/balances', requirePermission('inventory.read'), controller.getBalances);
router.get('/transfers', requirePermission('inventory.read'), controller.getTransfers);
router.post('/transfers', requirePermission('inventory.manage'), controller.createTransfer);

router.get('/adjustments', requirePermission('inventory.read'), controller.getAdjustments);
router.post('/adjustments', requirePermission('inventory.manage'), controller.createAdjustment);

router.get('/suppliers', requirePermission('inventory.read'), controller.getSuppliers);
router.post('/suppliers', requirePermission('inventory.manage'), controller.createSupplier);

router.get('/purchase-orders', requirePermission('inventory.read'), controller.getPurchaseOrders);
router.post('/purchase-orders', requirePermission('inventory.manage'), controller.createPurchaseOrder);

router.get('/goods-receipts', requirePermission('inventory.read'), controller.getGoodsReceipts);
router.post('/goods-receipts', requirePermission('inventory.manage'), controller.createGoodsReceipt);

router.get('/goods-issues', requirePermission('inventory.read'), controller.getGoodsIssues);
router.post('/goods-issues', requirePermission('inventory.manage'), controller.createGoodsIssue);

router.get('/batches', requirePermission('inventory.read'), controller.getBatches);
router.get('/serials', requirePermission('inventory.read'), controller.getSerials);

export default router;
