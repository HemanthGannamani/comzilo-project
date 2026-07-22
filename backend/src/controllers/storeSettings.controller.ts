import { Request, Response, NextFunction } from 'express';
import { StoreSettingsService } from '../services/storeSettings.service';
import { success } from '../shared/responses';
import { createAuditLog } from '../utils/auditHelper';
import { createActivityLog } from '../utils/activityHelper';

export class StoreSettingsController {
  private storeSettingsService = new StoreSettingsService();

  public getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = Number(req.params.storeId || req.headers['x-store-id']);
      const settings = await this.storeSettingsService.getStoreSettings(tenantId, storeId);
      success(res, 'Store settings retrieved successfully', settings);
    } catch (error) {
      next(error);
    }
  };

  public updateBulkSettings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = Number(req.params.storeId || req.headers['x-store-id']);
      const userId = req.context!.authenticatedUserId!;
      const { settings } = req.body;

      const previous = await this.storeSettingsService.getStoreSettings(tenantId, storeId);
      const updated = await this.storeSettingsService.updateBulkStoreSettings(
        tenantId,
        storeId,
        settings,
        userId
      );

      await createAuditLog(
        {
          tenantId,
          actorId: userId,
          action: 'STORE_SETTINGS_UPDATED',
          entityType: 'StoreSettings',
          entityId: storeId.toString(),
          previousValues: previous,
          newValues: updated,
        },
        req.context
      );

      await createActivityLog(
        {
          tenantId,
          userId,
          activityType: 'STORE_SETTINGS_UPDATED',
          description: `Updated store settings for store ${storeId}`,
        },
        req.context
      );

      success(res, 'Store settings updated successfully', updated);
    } catch (error) {
      next(error);
    }
  };

  public updateSingleSetting = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = Number(req.params.storeId || req.headers['x-store-id']);
      const userId = req.context!.authenticatedUserId!;
      const { key, value, isPublic } = req.body;

      const previousValue = await this.storeSettingsService.getSettingByKey(tenantId, storeId, key);
      const newValue = await this.storeSettingsService.updateStoreSetting(
        tenantId,
        storeId,
        key,
        value,
        userId,
        isPublic
      );

      await createAuditLog(
        {
          tenantId,
          actorId: userId,
          action: 'STORE_SETTING_UPDATED',
          entityType: 'StoreSettings',
          entityId: `${storeId}:${key}`,
          previousValues: { [key]: previousValue },
          newValues: { [key]: newValue },
        },
        req.context
      );

      success(res, `Store setting '${key}' updated successfully`, { key, value: newValue });
    } catch (error) {
      next(error);
    }
  };
}
