/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseService } from '../core/BaseService';
import { TenantSettingsRepository } from '../repositories/tenantSettings.repository';
import { SettingsHistoryRepository } from '../repositories/settingsHistory.repository';

export class TenantSettingsService extends BaseService {
  private tenantSettingsRepo = new TenantSettingsRepository();
  private historyRepo = new SettingsHistoryRepository();

  constructor() {
    super('TenantSettingsService');
  }

  public async getTenantSettings(tenantId: number): Promise<Record<string, any>> {
    return this.tenantSettingsRepo.getSettingsByTenant(tenantId);
  }

  public async getSettingByKey(tenantId: number, key: string): Promise<any> {
    const setting = await this.tenantSettingsRepo.getSetting(tenantId, key);
    return setting ? setting.settingValue : null;
  }

  public async updateTenantSetting(
    tenantId: number,
    key: string,
    value: any,
    userId?: number | null,
    category = 'general',
    isPublic = false
  ): Promise<any> {
    const previous = await this.tenantSettingsRepo.getSetting(tenantId, key);
    const prevValue = previous ? previous.settingValue : null;

    const updated = await this.tenantSettingsRepo.setSetting(
      tenantId,
      key,
      value,
      category,
      isPublic
    );

    await this.historyRepo.recordChange({
      tenantId,
      settingScope: 'tenant',
      settingKey: key,
      previousValue: prevValue,
      newValue: value,
      changedBy: userId,
    });

    return updated.settingValue;
  }

  public async updateBulkTenantSettings(
    tenantId: number,
    settings: Record<string, any>,
    userId?: number | null,
    category = 'general'
  ): Promise<Record<string, any>> {
    for (const [key, value] of Object.entries(settings)) {
      await this.updateTenantSetting(tenantId, key, value, userId, category);
    }
    return this.getTenantSettings(tenantId);
  }
}
