import { Request, Response, NextFunction } from 'express';
import { AdminPlatformUserService } from '../services/adminPlatformUser.service';
import { success, created } from '../shared/responses';

export class AdminPlatformUserController {
  private service = new AdminPlatformUserService();

  public listUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = req.query.search as string;
      const role = req.query.role as string;
      const status = req.query.status as string;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const result = await this.service.listPlatformUsers({ search, role, status, page, limit });
      success(res, 'Platform users retrieved successfully', result.users, {
        total: result.total,
        page: result.page,
        limit: result.limit,
      });
    } catch (error) {
      next(error);
    }
  };

  public getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const user = await this.service.getPlatformUserById(id);
      success(res, 'Platform user details retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.service.createPlatformUser(req.body, req.context);
      created(res, 'Platform user created successfully and onboarding email sent', user);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const user = await this.service.updatePlatformUser(id, req.body, req.context);
      success(res, 'Platform user updated successfully', user);
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const result = await this.service.resetPassword(id, req.context);
      success(res, 'Temporary password generated and email sent successfully', result);
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      await this.service.deletePlatformUser(id, req.context);
      success(res, 'Platform user deleted successfully', { id });
    } catch (error) {
      next(error);
    }
  };
}
