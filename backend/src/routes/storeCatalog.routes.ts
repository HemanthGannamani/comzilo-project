import { Router } from 'express';
import { StoreCatalogController } from '../controllers/storeCatalog.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantResolver } from '../middleware/tenantResolver';

const router = Router();

// Apply Auth and Tenant Isolation Middleware
router.use(authenticate);
router.use(tenantResolver);

// Categories
router.get('/categories', StoreCatalogController.getCategories);
router.post('/categories', StoreCatalogController.createCategory);
router.delete('/categories/:id', StoreCatalogController.deleteCategory);

// Brands
router.get('/brands', StoreCatalogController.getBrands);
router.post('/brands', StoreCatalogController.createBrand);

// Tags
router.get('/tags', StoreCatalogController.getTags);
router.post('/tags', StoreCatalogController.createTag);

// Collections
router.get('/collections', StoreCatalogController.getCollections);
router.post('/collections', StoreCatalogController.createCollection);

// Attributes
router.get('/attributes', StoreCatalogController.getAttributes);
router.post('/attributes', StoreCatalogController.createAttribute);

export default router;
