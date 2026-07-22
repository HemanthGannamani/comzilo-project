import express from 'express';
import { SellerApplicationController } from '../controllers/sellerApplication.controller';
import { validate } from '../middleware/validate';
import { createSellerApplicationSchema } from '../validations/sellerApplication.validation';

const router = express.Router();
const controller = new SellerApplicationController();

// Public routes (no authentication middleware needed)
router.post('/', validate(createSellerApplicationSchema), controller.createApplication);
router.post('/register', validate(createSellerApplicationSchema), controller.createApplication);
router.get('/:applicationNumber', controller.getApplicationStatus);
router.get('/status/:applicationNumber', controller.getApplicationStatus);

export default router;
