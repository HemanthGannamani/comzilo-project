import { Request, Response, NextFunction } from 'express';
import { ConfigurationService } from '../services/configuration.service';
import { success } from '../shared/responses';
import { createAuditLog } from '../utils/auditHelper';

export class ConfigurationController {
  private configService = new ConfigurationService();

  public getGlobalConfiguration = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const config = await this.configService.getGlobalConfiguration();
      success(res, 'Global configuration retrieved successfully', config);
    } catch (error) {
      next(error);
    }
  };

  public updateGlobalSetting = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.context?.authenticatedUserId || null;
      const tenantId = req.context?.tenantId || null;
      const { key, value, category, isPublic } = req.body;

      const previousValue = await this.configService.getSettingByKey(key);
      const newValue = await this.configService.setConfiguration(
        key,
        value,
        userId,
        category,
        isPublic
      );

      if (tenantId && userId) {
        await createAuditLog(
          {
            tenantId,
            actorId: userId,
            action: 'GLOBAL_CONFIG_UPDATED',
            entityType: 'SystemSettings',
            entityId: key,
            previousValues: { [key]: previousValue },
            newValues: { [key]: newValue },
          },
          req.context
        );
      }

      success(res, `Global configuration setting '${key}' updated successfully`, {
        key,
        value: newValue,
      });
    } catch (error) {
      next(error);
    }
  };

  public getFeatureFlags = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const flags = await this.configService.getFeatureFlags();
      success(res, 'Feature flags retrieved successfully', flags);
    } catch (error) {
      next(error);
    }
  };

  public updateFeatureFlags = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.context?.authenticatedUserId || null;
      const tenantId = req.context?.tenantId || null;
      const { flags } = req.body;

      const previous = await this.configService.getFeatureFlags();
      const updated = await this.configService.updateFeatureFlags(flags, userId);

      if (tenantId && userId) {
        await createAuditLog(
          {
            tenantId,
            actorId: userId,
            action: 'FEATURE_FLAGS_UPDATED',
            entityType: 'SystemSettings',
            entityId: 'feature_flags',
            previousValues: previous,
            newValues: updated,
          },
          req.context
        );
      }

      success(res, 'Feature flags updated successfully', updated);
    } catch (error) {
      next(error);
    }
  };

  public getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const scope = req.query.scope as string | undefined;
      const tenantId = req.context?.tenantId || undefined;
      const storeId = req.headers['x-store-id'] ? Number(req.headers['x-store-id']) : undefined;

      const history = await this.configService.getHistory(scope, tenantId, storeId);
      success(res, 'Settings history retrieved successfully', history);
    } catch (error) {
      next(error);
    }
  };
}
