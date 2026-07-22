import { Request, Response, NextFunction } from 'express';
import { CustomerPreferenceService } from '../services/customerPreference.service';
import { success } from '../shared/responses';
import { ValidationError } from '../shared/errors/AppError';

export class CustomerPreferenceController {
  private preferenceService = new CustomerPreferenceService();

  private getStoreId(req: Request): number {
    const storeId = Number(req.headers['x-store-id'] || req.query.storeId || req.body.storeId);
    if (!storeId || isNaN(storeId)) {
      throw new ValidationError('Store context is missing');
    }
    return storeId;
  }

  public getPreferences = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const customerId = Number(req.params.id);

      const pref = await this.preferenceService.getPreferences(tenantId, storeId, customerId);
      success(res, 'Preferences retrieved successfully', pref);
    } catch (error) {
      next(error);
    }
  };

  public updatePreferences = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const customerId = Number(req.params.id);
      const userId = req.context!.authenticatedUserId!;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];

      const pref = await this.preferenceService.updatePreferences(
        tenantId,
        storeId,
        customerId,
        userId,
        req.body,
        ip,
        userAgent
      );
      success(res, 'Preferences updated successfully', pref);
    } catch (error) {
      next(error);
    }
  };
}
