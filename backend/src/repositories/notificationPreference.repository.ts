/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from '../core/BaseRepository';
import { NotificationPreference } from '../database/models/notificationPreference';

export class NotificationPreferenceRepository extends BaseRepository<NotificationPreference> {
  constructor() {
    super(NotificationPreference);
  }

  public async findByUserId(
    tenantId: number,
    userId: number
  ): Promise<NotificationPreference | null> {
    return this.model.findOne({ where: { tenantId, userId } });
  }

  public async getOrCreateForUser(
    tenantId: number,
    userId: number
  ): Promise<NotificationPreference> {
    let pref = await this.findByUserId(tenantId, userId);
    if (!pref) {
      pref = await this.model.create({
        tenantId,
        userId,
        emailEnabled: true,
        smsEnabled: true,
        pushEnabled: true,
        whatsappEnabled: true,
        orderNotifications: true,
        paymentNotifications: true,
        inventoryAlerts: true,
        systemAlerts: true,
        marketingNotifications: false,
      });
    }
    return pref!;
  }
}
