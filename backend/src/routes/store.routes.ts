import express from 'express';
import { StoreController } from '../controllers/store.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate } from '../middleware/validate';
import {
  createStoreSchema,
  updateStoreSchema,
  updateSettingsSchema,
  domainSchema,
} from '../validations/store.validation';

const router = express.Router();
const controller = new StoreController();

router.use(tenantResolver);
router.use(authenticate);
router.use(authorize);

router.get('/', requirePermission('store.read'), controller.listStores);

router.post(
  '/',
  requirePermission('store.create'),
  validate(createStoreSchema),
  controller.createStore
);

router.get('/:id', requirePermission('store.read', 'id'), controller.getStore);

router.put(
  '/:id',
  requirePermission('store.update', 'id'),
  validate(updateStoreSchema),
  controller.updateStore
);

router.delete('/:id', requirePermission('store.delete', 'id'), controller.deleteStore);

router.post('/:id/restore', requirePermission('store.delete', 'id'), controller.restoreStore);

// Settings
router.get('/:id/settings', requirePermission('store.read', 'id'), controller.getSettings);

router.put(
  '/:id/settings',
  requirePermission('store.update', 'id'),
  validate(updateSettingsSchema),
  controller.updateSettings
);

// Custom Domains
router.post(
  '/:id/domain',
  requirePermission('store.update', 'id'),
  validate(domainSchema),
  controller.addDomain
);

router.delete('/:id/domain', requirePermission('store.update', 'id'), controller.removeDomain);

router.post('/:id/domain/verify', requirePermission('store.update', 'id'), controller.verifyDomain);

router.post(
  '/:id/domain/primary',
  requirePermission('store.update', 'id'),
  controller.setPrimaryDomain
);

export default router;
