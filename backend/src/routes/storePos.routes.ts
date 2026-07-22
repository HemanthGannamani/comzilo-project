import { Router } from 'express';
import { StorePosController } from '../controllers/storePos.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantResolver } from '../middleware/tenantResolver';

const router = Router();

// Apply Auth and Tenant Isolation Middleware
router.use(authenticate);
router.use(tenantResolver);

// Registers & Sessions
router.get('/registers', StorePosController.getRegisters);
router.post('/registers', StorePosController.createRegister);
router.post('/registers/open-session', StorePosController.openSession);
router.post('/registers/close-session', StorePosController.closeSession);
router.post('/registers/cash-movement', StorePosController.addCashMovement);

// Sales Checkout
router.post('/sales/process', StorePosController.processSale);

// Returns & Refunds
router.post('/returns/process', StorePosController.processReturn);

// Offline Queue Synchronization
router.post('/offline-sync', StorePosController.syncOfflineQueue);

export default router;
