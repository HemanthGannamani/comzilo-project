/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from '../core/BaseRepository';
import { StoreSettings } from '../database/models/storeSettings';

export class StoreSettingsRepository extends BaseRepository<StoreSettings> {
  constructor() {
    super(StoreSettings);
  }

  public async findByStoreId(tenantId: number | null, storeId: number): Promise<StoreSettings[]> {
    const where: any = { storeId };
    if (tenantId) where.tenantId = tenantId;
    return this.model.findAll({ where });
  }

  public async getSetting(
    tenantId: number,
    storeId: number,
    key: string
  ): Promise<StoreSettings | null> {
    return this.model.findOne({
      where: { tenantId, storeId, settingKey: key },
    });
  }

  public async setSetting(
    tenantId: number,
    storeId: number,
    key: string,
    value: any,
    isPublic = false
  ): Promise<StoreSettings> {
    const existing = await this.getSetting(tenantId, storeId, key);
    if (existing) {
      return existing.update({ settingValue: value, isPublic });
    }
    return this.model.create({
      tenantId,
      storeId,
      settingKey: key,
      settingValue: value,
      isPublic,
    });
  }

  public async getSettingsByStore(tenantId: number, storeId: number): Promise<Record<string, any>> {
    const records = await this.model.findAll({
      where: { tenantId, storeId },
    });
    const result: Record<string, any> = {};
    for (const item of records) {
      result[item.settingKey] = item.settingValue;
    }
    return result;
  }
}
