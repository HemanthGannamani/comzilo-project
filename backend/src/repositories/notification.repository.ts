/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from '../core/BaseRepository';
import { Notification } from '../database/models/notification';

export class NotificationRepository extends BaseRepository<Notification> {
  constructor() {
    super(Notification);
  }

  public async getUnreadCount(tenantId: number, userId: number): Promise<number> {
    return this.model.count({
      where: {
        tenantId,
        userId,
        channel: 'in_app',
        status: ['pending', 'sent'],
      },
    });
  }

  public async markAllAsRead(tenantId: number, userId: number): Promise<[number]> {
    return this.model.update(
      { status: 'read', readAt: new Date() },
      {
        where: {
          tenantId,
          userId,
          channel: 'in_app',
          status: ['pending', 'sent'],
        },
      }
    );
  }
}
