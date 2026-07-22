import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../services/settings.service';
import { success } from '../shared/responses';

export class SettingsController {
  private settingsService = new SettingsService();

  public getResolvedSettings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = req.headers['x-store-id'] ? Number(req.headers['x-store-id']) : null;

      const settings = await this.settingsService.getResolvedConfiguration(tenantId, storeId);
      success(res, 'Resolved settings retrieved successfully', settings);
    } catch (error) {
      next(error);
    }
  };

  public resolveSingleKey = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = req.headers['x-store-id'] ? Number(req.headers['x-store-id']) : null;
      const key = req.params.key;
      const defaultValue = req.query.defaultValue || null;

      const value = await this.settingsService.resolveSetting(tenantId, storeId, key, defaultValue);
      success(res, `Resolved setting for '${key}'`, { key, value });
    } catch (error) {
      next(error);
    }
  };
}
