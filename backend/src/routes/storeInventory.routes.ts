import { Router } from 'express';
import { StoreInventoryController } from '../controllers/storeInventory.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantResolver } from '../middleware/tenantResolver';

const router = Router();

// Apply Auth and Tenant Isolation Middleware
router.use(authenticate);
router.use(tenantResolver);

// Warehouses & Locations
router.get('/warehouses', StoreInventoryController.getWarehouses);
router.post('/warehouses', StoreInventoryController.createWarehouse);
router.post('/warehouses/:warehouseId/locations', StoreInventoryController.createLocation);

// Inventory Stock Items & Stock Adjustments
router.get('/items', StoreInventoryController.getInventoryItems);
router.post('/items/update-stock', StoreInventoryController.updateStock);

// Ledger Movements
router.get('/movements', StoreInventoryController.getMovements);

// Transfers Workflow
router.get('/transfers', StoreInventoryController.getTransfers);
router.post('/transfers', StoreInventoryController.createTransfer);
router.patch('/transfers/:id/status', StoreInventoryController.updateTransferStatus);

// Reservations
router.post('/reservations', StoreInventoryController.createReservation);

// Batches & Serials
router.post('/batches', StoreInventoryController.createBatch);
router.post('/serials', StoreInventoryController.createSerial);

// Cycle Counts
router.post('/cycle-counts', StoreInventoryController.createCycleCount);

export default router;
