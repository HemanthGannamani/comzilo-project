import express from 'express';
import { AdminRoleController } from '../controllers/adminRole.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();
const controller = new AdminRoleController();

router.use(authenticate);

router.get('/permissions', controller.listPermissions);
router.get('/', controller.listRoles);
router.get('/:id', controller.getRole);
router.post('/', controller.createRole);
router.put('/:id', controller.updateRole);
router.patch('/:id', controller.updateRole);
router.delete('/:id', controller.deleteRole);
router.post('/assign-user', controller.assignUserRole);

export default router;
