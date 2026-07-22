import { Router } from 'express';
import { CollectionController } from '../controllers/collection.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';
import { validate as validateRequest } from '../middleware/validate';
import { collectionValidation } from '../validations/collection.validation';

const router = Router();
const controller = new CollectionController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

router.get(
  '/',
  requirePermission('collection.read'),
  validateRequest({ query: collectionValidation.listCollections }),
  controller.listCollections
);

router.post(
  '/',
  requirePermission('collection.create'),
  validateRequest({ body: collectionValidation.createCollection }),
  controller.createCollection
);

router.get('/:id', requirePermission('collection.read', 'id'), controller.getCollection);

router.put(
  '/:id',
  requirePermission('collection.update', 'id'),
  validateRequest({ body: collectionValidation.updateCollection }),
  controller.updateCollection
);

router.delete('/:id', requirePermission('collection.delete', 'id'), controller.deleteCollection);

router.post(
  '/:id/restore',
  requirePermission('collection.restore', 'id'),
  controller.restoreCollection
);

// --- COLLECTION PRODUCTS ASSOCIATIONS ---

router.get(
  '/:id/products',
  requirePermission('collection.read', 'id'),
  controller.listCollectionProducts
);

router.post(
  '/:id/products',
  requirePermission('collection.manage_products', 'id'),
  validateRequest({ body: collectionValidation.addProduct }),
  controller.addProductToCollection
);

router.delete(
  '/:id/products/:productId',
  requirePermission('collection.manage_products', 'id'),
  controller.removeProductFromCollection
);

router.put(
  '/:id/products',
  requirePermission('collection.manage_products', 'id'),
  validateRequest({ body: collectionValidation.replaceProducts }),
  controller.replaceProductsInCollection
);

router.patch(
  '/:id/products/reorder',
  requirePermission('collection.manage_products', 'id'),
  validateRequest({ body: collectionValidation.reorderProducts }),
  controller.reorderProductsInCollection
);

export { router as collectionRoutes };
