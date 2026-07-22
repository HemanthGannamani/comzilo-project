/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from '../core/BaseRepository';
import { TenantSettings } from '../database/models/tenantSettings';

export class TenantSettingsRepository extends BaseRepository<TenantSettings> {
  constructor() {
    super(TenantSettings);
  }

  public async getSetting(tenantId: number, key: string): Promise<TenantSettings | null> {
    return this.model.findOne({
      where: { tenantId, settingKey: key },
    });
  }

  public async setSetting(
    tenantId: number,
    key: string,
    value: any,
    category = 'general',
    isPublic = false
  ): Promise<TenantSettings> {
    const existing = await this.getSetting(tenantId, key);
    if (existing) {
      return existing.update({ settingValue: value, category, isPublic });
    }
    return this.model.create({
      tenantId,
      settingKey: key,
      settingValue: value,
      category,
      isPublic,
    });
  }

  public async getSettingsByTenant(tenantId: number): Promise<Record<string, any>> {
    const records = await this.model.findAll({
      where: { tenantId },
    });
    const result: Record<string, any> = {};
    for (const item of records) {
      result[item.settingKey] = item.settingValue;
    }
    return result;
  }
}
