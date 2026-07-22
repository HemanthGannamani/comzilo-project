import { Request, Response, NextFunction } from 'express';
import { TenantSettingsService } from '../services/tenantSettings.service';
import { success } from '../shared/responses';
import { createAuditLog } from '../utils/auditHelper';
import { createActivityLog } from '../utils/activityHelper';

export class TenantSettingsController {
  private tenantSettingsService = new TenantSettingsService();

  public getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const settings = await this.tenantSettingsService.getTenantSettings(tenantId);
      success(res, 'Tenant settings retrieved successfully', settings);
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
      const userId = req.context!.authenticatedUserId!;
      const { settings, category } = req.body;

      const previous = await this.tenantSettingsService.getTenantSettings(tenantId);
      const updated = await this.tenantSettingsService.updateBulkTenantSettings(
        tenantId,
        settings,
        userId,
        category
      );

      await createAuditLog(
        {
          tenantId,
          actorId: userId,
          action: 'TENANT_SETTINGS_UPDATED',
          entityType: 'TenantSettings',
          entityId: tenantId.toString(),
          previousValues: previous,
          newValues: updated,
        },
        req.context
      );

      await createActivityLog(
        {
          tenantId,
          userId,
          activityType: 'TENANT_SETTINGS_UPDATED',
          description: `Updated tenant settings`,
        },
        req.context
      );

      success(res, 'Tenant settings updated successfully', updated);
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
      const userId = req.context!.authenticatedUserId!;
      const { key, value, category, isPublic } = req.body;

      const previousValue = await this.tenantSettingsService.getSettingByKey(tenantId, key);
      const newValue = await this.tenantSettingsService.updateTenantSetting(
        tenantId,
        key,
        value,
        userId,
        category,
        isPublic
      );

      await createAuditLog(
        {
          tenantId,
          actorId: userId,
          action: 'TENANT_SETTING_UPDATED',
          entityType: 'TenantSettings',
          entityId: key,
          previousValues: { [key]: previousValue },
          newValues: { [key]: newValue },
        },
        req.context
      );

      success(res, `Tenant setting '${key}' updated successfully`, { key, value: newValue });
    } catch (error) {
      next(error);
    }
  };
}
