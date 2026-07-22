/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from '../core/BaseRepository';
import { SettingsHistory } from '../database/models/settingsHistory';

export class SettingsHistoryRepository extends BaseRepository<SettingsHistory> {
  constructor() {
    super(SettingsHistory);
  }

  public async recordChange(data: {
    tenantId?: number | null;
    storeId?: number | null;
    settingScope: 'global' | 'tenant' | 'store';
    settingKey: string;
    previousValue: any;
    newValue: any;
    changedBy?: number | null;
  }): Promise<SettingsHistory> {
    return this.model.create({
      tenantId: data.tenantId || null,
      storeId: data.storeId || null,
      settingScope: data.settingScope,
      settingKey: data.settingKey,
      previousValue: data.previousValue,
      newValue: data.newValue,
      changedBy: data.changedBy || null,
    });
  }

  public async getHistory(
    scope?: string,
    tenantId?: number,
    storeId?: number
  ): Promise<SettingsHistory[]> {
    const where: any = {};
    if (scope) where.settingScope = scope;
    if (tenantId) where.tenantId = tenantId;
    if (storeId) where.storeId = storeId;
    return this.model.findAll({
      where,
      order: [['id', 'DESC']],
    });
  }
}
