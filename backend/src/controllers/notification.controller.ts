import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { success, created } from '../shared/responses';
import { createAuditLog } from '../utils/auditHelper';

export class NotificationController {
  private notificationService = new NotificationService();

  public sendNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = req.headers['x-store-id'] ? Number(req.headers['x-store-id']) : null;
      const userId = req.context!.authenticatedUserId!;

      const notification = await this.notificationService.sendNotification(
        tenantId,
        storeId,
        req.body
      );

      await createAuditLog(
        {
          tenantId,
          actorId: userId,
          action: 'NOTIFICATION_SENT',
          entityType: 'Notification',
          entityId: notification.id.toString(),
          previousValues: null,
          newValues: notification.toJSON(),
        },
        req.context
      );

      created(res, 'Notification processed successfully', notification);
    } catch (error) {
      next(error);
    }
  };

  public listInAppNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const userId = req.context!.authenticatedUserId!;

      const result = await this.notificationService.listInAppNotifications(
        tenantId,
        userId,
        req.query
      );

      success(res, 'In-app notifications retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  };

  public getUnreadCount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const userId = req.context!.authenticatedUserId!;

      const unreadCount = await this.notificationService.getUnreadCount(tenantId, userId);

      success(res, 'Unread count retrieved successfully', { unreadCount });
    } catch (error) {
      next(error);
    }
  };

  public markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const userId = req.context!.authenticatedUserId!;
      const id = Number(req.params.id);

      const notification = await this.notificationService.markAsRead(tenantId, userId, id);

      success(res, 'Notification marked as read', notification);
    } catch (error) {
      next(error);
    }
  };

  public markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const userId = req.context!.authenticatedUserId!;

      const result = await this.notificationService.markAllAsRead(tenantId, userId);

      success(res, 'All notifications marked as read', result);
    } catch (error) {
      next(error);
    }
  };

  public deleteNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const userId = req.context!.authenticatedUserId!;
      const id = Number(req.params.id);

      await this.notificationService.deleteNotification(tenantId, userId, id);

      success(res, 'Notification deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
