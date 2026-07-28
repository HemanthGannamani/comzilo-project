import express from 'express';
import { AdminPlatformUserController } from '../controllers/adminPlatformUser.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();
const controller = new AdminPlatformUserController();

router.use(authenticate);

router.get('/', controller.listUsers);
router.get('/:id', controller.getUser);
router.post('/', controller.createUser);
router.put('/:id', controller.updateUser);
router.patch('/:id', controller.updateUser);
router.post('/:id/reset-password', controller.resetPassword);
router.delete('/:id', controller.deleteUser);

export default router;
