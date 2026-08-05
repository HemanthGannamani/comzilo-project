import express from 'express';
import { AttributeManagementController } from '../controllers/attributeManagement.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();
const controller = new AttributeManagementController();

router.use(tenantResolver);
router.use(authenticate);

// Groups
router.get('/groups', controller.getAttributeGroups);
router.post('/groups', controller.createAttributeGroup);
router.put('/groups/:id', controller.updateAttributeGroup);
router.delete('/groups/:id', controller.deleteAttributeGroup);

// Values
router.get('/groups/:groupId/values', controller.getAttributeValues);
router.post('/values', controller.createAttributeValue);
router.put('/values/:id', controller.updateAttributeValue);
router.delete('/values/:id', controller.deleteAttributeValue);

// Category Attributes
router.get('/category-attributes', controller.getCategoryAttributes);
router.post('/category-attributes', controller.createCategoryAttribute);
router.put('/category-attributes/:id', controller.updateCategoryAttribute);
router.delete('/category-attributes/:id', controller.deleteCategoryAttribute);

export default router;
