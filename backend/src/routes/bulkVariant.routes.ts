import { Router } from 'express';
import { BulkVariantController } from '../controllers/bulkVariant.controller';

const router = Router();
const controller = new BulkVariantController();

router.get('/search', (req, res, next) => controller.searchVariants(req, res, next));
router.post('/price-update', (req, res, next) => controller.updatePrice(req, res, next));
router.post('/inventory-update', (req, res, next) => controller.updateInventory(req, res, next));
router.post('/sku-barcode-update', (req, res, next) => controller.updateSkuBarcode(req, res, next));
router.post('/import', (req, res, next) => controller.importVariants(req, res, next));
router.get('/export', (req, res, next) => controller.exportCSV(req, res, next));

export default router;
