import express from 'express';
import { StoreInventoryManagementController } from '../controllers/storeInventoryManagement.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate } from '../middleware/auth.middleware';
import { authorize, requireAnyPermission } from '../middleware/authz.middleware';

const router = express.Router();
const controller = new StoreInventoryManagementController();

router.use(tenantResolver);
router.use(authenticate);
router.use(authorize);

router.get('/dashboard', requireAnyPermission(['inventory.read', 'warehouse.read', 'warehouse.view']), controller.getDashboard);
router.get('/warehouses', requireAnyPermission(['warehouse.read', 'warehouse.view', 'inventory.read']), controller.getWarehouses);
router.post('/warehouses', requireAnyPermission(['warehouse.create', 'warehouse.manage', 'inventory.manage']), controller.createWarehouse);
router.get('/locations', requireAnyPermission(['warehouse.read', 'warehouse.view', 'warehouse_location.read', 'inventory.read']), controller.getLocations);
router.post('/locations', requireAnyPermission(['warehouse.create', 'warehouse.manage', 'warehouse_location.create', 'inventory.manage']), controller.createLocation);

router.get('/balances', requireAnyPermission(['inventory.read', 'warehouse.read']), controller.getBalances);
router.get('/transfers', requireAnyPermission(['inventory.read', 'warehouse.read', 'inventory.transfer']), controller.getTransfers);
router.post('/transfers', requireAnyPermission(['inventory.manage', 'inventory.transfer', 'warehouse.create', 'warehouse.manage']), controller.createTransfer);

router.get('/adjustments', requireAnyPermission(['inventory.read', 'inventory.adjust']), controller.getAdjustments);
router.post('/adjustments', requireAnyPermission(['inventory.manage', 'inventory.adjust']), controller.createAdjustment);

router.get('/suppliers', requireAnyPermission(['inventory.read', 'supplier.read']), controller.getSuppliers);
router.post('/suppliers', requireAnyPermission(['inventory.manage', 'supplier.create', 'supplier.manage']), controller.createSupplier);
router.put('/suppliers/:id', requireAnyPermission(['inventory.manage', 'supplier.create', 'supplier.manage']), controller.updateSupplier);
router.delete('/suppliers/:id', requireAnyPermission(['inventory.manage', 'supplier.create', 'supplier.manage']), controller.deleteSupplier);

router.get('/purchase-orders', requireAnyPermission(['inventory.read', 'po.read']), controller.getPurchaseOrders);
router.post('/purchase-orders', requireAnyPermission(['inventory.manage', 'po.create', 'po.manage']), controller.createPurchaseOrder);

router.get('/goods-receipts', requireAnyPermission(['inventory.read', 'grn.read']), controller.getGoodsReceipts);
router.post('/goods-receipts', requireAnyPermission(['inventory.manage', 'grn.create']), controller.createGoodsReceipt);

router.get('/goods-issues', requireAnyPermission(['inventory.read', 'gin.read']), controller.getGoodsIssues);
router.post('/goods-issues', requireAnyPermission(['inventory.manage', 'gin.create']), controller.createGoodsIssue);

router.get('/batches', requireAnyPermission(['inventory.read', 'batch.read']), controller.getBatches);
router.get('/serials', requireAnyPermission(['inventory.read', 'serial.read']), controller.getSerials);

export default router;
