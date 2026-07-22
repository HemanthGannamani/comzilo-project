/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseService } from '../core/BaseService';
import { SystemSettingsRepository } from '../repositories/systemSettings.repository';
import { SettingsHistoryRepository } from '../repositories/settingsHistory.repository';
import { SettingsHistory } from '../database/models/settingsHistory';

export class ConfigurationService extends BaseService {
  private systemSettingsRepo = new SystemSettingsRepository();
  private historyRepo = new SettingsHistoryRepository();

  constructor() {
    super('ConfigurationService');
  }

  public async getGlobalConfiguration(): Promise<Record<string, any>> {
    return this.systemSettingsRepo.getAllSettings();
  }

  public async getSettingByKey(key: string): Promise<any> {
    const setting = await this.systemSettingsRepo.getSetting(key);
    return setting ? setting.settingValue : null;
  }

  public async setConfiguration(
    key: string,
    value: any,
    userId?: number | null,
    category = 'system',
    isPublic = false
  ): Promise<any> {
    const previous = await this.systemSettingsRepo.getSetting(key);
    const prevValue = previous ? previous.settingValue : null;

    const updated = await this.systemSettingsRepo.setSetting(key, value, category, isPublic);

    await this.historyRepo.recordChange({
      settingScope: 'global',
      settingKey: key,
      previousValue: prevValue,
      newValue: value,
      changedBy: userId,
    });

    return updated.settingValue;
  }

  public async getFeatureFlags(): Promise<Record<string, boolean>> {
    const flags = (await this.getSettingByKey('feature_flags')) || {
      pos: true,
      inventory: true,
      reports: true,
      notifications: true,
      loyalty: true,
      coupons: true,
      multi_store: true,
      multi_currency: true,
    };
    return flags;
  }

  public async updateFeatureFlags(
    flags: Record<string, boolean>,
    userId?: number | null
  ): Promise<Record<string, boolean>> {
    const current = await this.getFeatureFlags();
    const updatedFlags = { ...current, ...flags };
    await this.setConfiguration('feature_flags', updatedFlags, userId, 'feature_flags');
    return updatedFlags;
  }

  public async getHistory(
    scope?: string,
    tenantId?: number,
    storeId?: number
  ): Promise<SettingsHistory[]> {
    return this.historyRepo.getHistory(scope, tenantId, storeId);
  }
}
