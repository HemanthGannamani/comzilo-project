import { Request, Response, NextFunction } from 'express';
import { PlanService } from '../services/plan.service';
import { success, created } from '../shared/responses';

export class PlanController {
  private planService = new PlanService();

  public listPlans = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const plans = await this.planService.listPlans();
      success(res, 'Subscription plans retrieved successfully', plans);
    } catch (error) {
      next(error);
    }
  };

  public getPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const plan = await this.planService.getPlanById(id);
      success(res, 'Subscription plan retrieved successfully', plan);
    } catch (error) {
      next(error);
    }
  };

  public createPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const plan = await this.planService.createPlan(req.body);
      created(res, 'Subscription plan created successfully', plan);
    } catch (error) {
      next(error);
    }
  };

  public updatePlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const plan = await this.planService.updatePlan(id, req.body);
      success(res, 'Subscription plan updated successfully', plan);
    } catch (error) {
      next(error);
    }
  };

  public deletePlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      await this.planService.deletePlan(id);
      success(res, 'Subscription plan deleted successfully', { id });
    } catch (error) {
      next(error);
    }
  };
}
