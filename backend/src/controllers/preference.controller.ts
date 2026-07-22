import { Request, Response, NextFunction } from 'express';
import { PreferenceService } from '../services/preference.service';
import { success } from '../shared/responses';
import { createAuditLog } from '../utils/auditHelper';

export class PreferenceController {
  private preferenceService = new PreferenceService();

  public getPreferences = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const userId = req.context!.authenticatedUserId!;

      const preferences = await this.preferenceService.getUserPreferences(tenantId, userId);

      success(res, 'Notification preferences retrieved successfully', preferences);
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
      const userId = req.context!.authenticatedUserId!;

      const previous = await this.preferenceService.getUserPreferences(tenantId, userId);
      const updated = await this.preferenceService.updatePreferences(tenantId, userId, req.body);

      await createAuditLog(
        {
          tenantId,
          actorId: userId,
          action: 'NOTIFICATION_PREFERENCE_UPDATED',
          entityType: 'NotificationPreference',
          entityId: updated.id.toString(),
          previousValues: previous.toJSON(),
          newValues: updated.toJSON(),
        },
        req.context
      );

      success(res, 'Notification preferences updated successfully', updated);
    } catch (error) {
      next(error);
    }
  };
}
