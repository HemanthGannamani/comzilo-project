import express from 'express';
import { StoreShippingProviderController } from '../controllers/storeShippingProvider.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';

const router = express.Router();
const controller = new StoreShippingProviderController();

router.use(tenantResolver);
router.use(authenticate);
router.use(authorize);

router.get('/providers', requirePermission('store.view'), controller.getProviders);
router.post('/providers/:providerId/configure', requirePermission('store.manage'), controller.configureProvider);
router.post('/providers/test-connection', requirePermission('store.manage'), controller.testConnection);

router.get('/zones', requirePermission('store.view'), controller.getZones);
router.post('/zones', requirePermission('store.manage'), controller.createZone);

router.get('/methods', requirePermission('store.view'), controller.getMethods);
router.post('/methods', requirePermission('store.manage'), controller.createMethod);

router.get('/pickup-addresses', requirePermission('store.view'), controller.getPickupAddresses);
router.post('/pickup-addresses', requirePermission('store.manage'), controller.createPickupAddress);

router.get('/packages', requirePermission('store.view'), controller.getPackages);
router.post('/packages', requirePermission('store.manage'), controller.createPackage);

router.post('/calculate-rate', requirePermission('store.view'), controller.calculateRate);
router.post('/shipments', requirePermission('store.manage'), controller.createShipment);
router.get('/shipments', requirePermission('store.view'), controller.getShipments);
router.get('/logs', requirePermission('store.view'), controller.getLogs);

export default router;
