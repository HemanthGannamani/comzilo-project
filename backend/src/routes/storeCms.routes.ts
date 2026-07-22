import { Router } from 'express';
import { StoreCmsController } from '../controllers/storeCms.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantResolver } from '../middleware/tenantResolver';

const router = Router();

// Apply Auth and Tenant Isolation Middleware
router.use(authenticate);
router.use(tenantResolver);

// Themes
router.get('/themes', StoreCmsController.getThemes);
router.post('/themes', StoreCmsController.createTheme);
router.patch('/themes/:id/activate', StoreCmsController.activateTheme);

// Pages & Page Builder
router.get('/pages', StoreCmsController.getPages);
router.post('/pages', StoreCmsController.createPage);
router.post('/pages/sections', StoreCmsController.addPageSection);
router.patch('/pages/:id/publish', StoreCmsController.publishPage);

// Navigation Menus
router.get('/navigation', StoreCmsController.getNavigationMenus);
router.post('/navigation', StoreCmsController.createNavigationMenu);

// Blog Posts
router.get('/blog', StoreCmsController.getBlogPosts);
router.post('/blog', StoreCmsController.createBlogPost);

// Media Assets
router.get('/media', StoreCmsController.getMediaAssets);
router.post('/media', StoreCmsController.createMediaAsset);

// Forms & Submissions
router.get('/forms', StoreCmsController.getForms);
router.post('/forms', StoreCmsController.createForm);
router.post('/forms/:id/submit', StoreCmsController.submitForm);

export default router;
