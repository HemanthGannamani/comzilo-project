import { Router } from 'express';
import { PlanController } from '../controllers/plan.controller';

const router = Router();
const controller = new PlanController();

router.get('/', controller.listPlans);
router.get('/:id', controller.getPlan);
router.post('/', controller.createPlan);
router.put('/:id', controller.updatePlan);
router.patch('/:id', controller.updatePlan);
router.delete('/:id', controller.deletePlan);

export default router;
