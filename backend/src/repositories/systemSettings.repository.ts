/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from '../core/BaseRepository';
import { SystemSettings } from '../database/models/systemSettings';

export class SystemSettingsRepository extends BaseRepository<SystemSettings> {
  constructor() {
    super(SystemSettings);
  }

  public async getSetting(key: string): Promise<SystemSettings | null> {
    return this.model.findOne({
      where: { settingKey: key },
    });
  }

  public async setSetting(
    key: string,
    value: any,
    category = 'system',
    isPublic = false
  ): Promise<SystemSettings> {
    const existing = await this.getSetting(key);
    if (existing) {
      return existing.update({ settingValue: value, category, isPublic });
    }
    return this.model.create({
      settingKey: key,
      settingValue: value,
      category,
      isPublic,
    });
  }

  public async getAllSettings(): Promise<Record<string, any>> {
    const records = await this.model.findAll();
    const result: Record<string, any> = {};
    for (const item of records) {
      result[item.settingKey] = item.settingValue;
    }
    return result;
  }
}
