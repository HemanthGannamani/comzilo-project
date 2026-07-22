/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseService } from '../core/BaseService';
import { StoreSettingsRepository } from '../repositories/storeSettings.repository';
import { SettingsHistoryRepository } from '../repositories/settingsHistory.repository';

export class StoreSettingsService extends BaseService {
  private storeSettingsRepo = new StoreSettingsRepository();
  private historyRepo = new SettingsHistoryRepository();

  constructor() {
    super('StoreSettingsService');
  }

  public async getStoreSettings(tenantId: number, storeId: number): Promise<Record<string, any>> {
    return this.storeSettingsRepo.getSettingsByStore(tenantId, storeId);
  }

  public async getSettingByKey(tenantId: number, storeId: number, key: string): Promise<any> {
    const setting = await this.storeSettingsRepo.getSetting(tenantId, storeId, key);
    return setting ? setting.settingValue : null;
  }

  public async updateStoreSetting(
    tenantId: number,
    storeId: number,
    key: string,
    value: any,
    userId?: number | null,
    isPublic = false
  ): Promise<any> {
    const previous = await this.storeSettingsRepo.getSetting(tenantId, storeId, key);
    const prevValue = previous ? previous.settingValue : null;

    const updated = await this.storeSettingsRepo.setSetting(
      tenantId,
      storeId,
      key,
      value,
      isPublic
    );

    await this.historyRepo.recordChange({
      tenantId,
      storeId,
      settingScope: 'store',
      settingKey: key,
      previousValue: prevValue,
      newValue: value,
      changedBy: userId,
    });

    return updated.settingValue;
  }

  public async updateBulkStoreSettings(
    tenantId: number,
    storeId: number,
    settings: Record<string, any>,
    userId?: number | null
  ): Promise<Record<string, any>> {
    for (const [key, value] of Object.entries(settings)) {
      await this.updateStoreSetting(tenantId, storeId, key, value, userId);
    }
    return this.getStoreSettings(tenantId, storeId);
  }
}
