import { Router } from 'express';
import { StoreShippingController } from '../controllers/storeShipping.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantResolver } from '../middleware/tenantResolver';

const router = Router();

// Apply Auth and Tenant Isolation Middleware
router.use(authenticate);
router.use(tenantResolver);

// Shipping Zones & Methods
router.get('/zones', StoreShippingController.getZones);
router.post('/zones', StoreShippingController.createZone);
router.post('/methods', StoreShippingController.createMethod);

// Carriers
router.get('/carriers', StoreShippingController.getCarriers);
router.post('/carriers', StoreShippingController.createCarrier);

// Shipments & Tracking
router.get('/shipments', StoreShippingController.getShipments);
router.post('/shipments', StoreShippingController.createShipment);
router.patch('/shipments/:id/status', StoreShippingController.updateShipmentStatus);

// Carrier Pickups
router.post('/pickups', StoreShippingController.schedulePickup);

export default router;
