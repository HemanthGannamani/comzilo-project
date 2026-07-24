import { Router } from 'express';
import { CatalogController } from '../controllers/catalog.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const controller = new CatalogController();

// Public Storefront Catalog APIs
router.get('/categories', controller.getCategories);
router.get('/brands', controller.getBrands);
router.get('/collections', controller.getCollections);
router.get('/attributes', controller.getAttributes);
router.get('/tags', controller.getTags);
router.get('/filters', controller.getCatalogFilters);

// Protected Seller Panel Admin Catalog Management APIs
router.post('/categories', authenticate, controller.createCategory);
router.put('/categories/:id', authenticate, controller.updateCategory);
router.delete('/categories/:id', authenticate, controller.deleteCategory);

router.post('/brands', authenticate, controller.createBrand);
router.post('/collections', authenticate, controller.createCollection);
router.post('/attributes', authenticate, controller.createAttribute);
router.post('/tags', authenticate, controller.createTag);

export default router;
