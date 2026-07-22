/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseService } from '../core/BaseService';
import { NotificationPreferenceRepository } from '../repositories/notificationPreference.repository';
import { NotificationPreference } from '../database/models/notificationPreference';

export class PreferenceService extends BaseService {
  private preferenceRepo = new NotificationPreferenceRepository();

  constructor() {
    super('PreferenceService');
  }

  public async getUserPreferences(
    tenantId: number,
    userId: number
  ): Promise<NotificationPreference> {
    return this.preferenceRepo.getOrCreateForUser(tenantId, userId);
  }

  public async updatePreferences(
    tenantId: number,
    userId: number,
    data: Partial<any>
  ): Promise<NotificationPreference> {
    const pref = await this.preferenceRepo.getOrCreateForUser(tenantId, userId);
    return pref.update(data);
  }

  public async isChannelAllowed(
    tenantId: number,
    userId: number,
    channel: 'email' | 'sms' | 'push' | 'in_app' | 'whatsapp'
  ): Promise<boolean> {
    const pref = await this.preferenceRepo.getOrCreateForUser(tenantId, userId);
    if (channel === 'email') return pref.emailEnabled;
    if (channel === 'sms') return pref.smsEnabled;
    if (channel === 'push') return pref.pushEnabled;
    if (channel === 'whatsapp') return pref.whatsappEnabled;
    if (channel === 'in_app') return true;
    return true;
  }
}
