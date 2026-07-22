/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseService } from '../core/BaseService';
import { TenantSettingsService } from './tenantSettings.service';
import { StoreSettingsService } from './storeSettings.service';
import { ConfigurationService } from './configuration.service';

export class SettingsService extends BaseService {
  private tenantSettingsService = new TenantSettingsService();
  private storeSettingsService = new StoreSettingsService();
  private configurationService = new ConfigurationService();

  constructor() {
    super('SettingsService');
  }

  /**
   * Resolve a setting key by looking up: Store level -> Tenant level -> Global level -> Fallback default
   */
  public async resolveSetting<T = any>(
    tenantId: number,
    storeId: number | null,
    key: string,
    defaultValue: T
  ): Promise<T> {
    if (storeId) {
      const storeVal = await this.storeSettingsService.getSettingByKey(tenantId, storeId, key);
      if (storeVal !== null && storeVal !== undefined) return storeVal as T;
    }

    const tenantVal = await this.tenantSettingsService.getSettingByKey(tenantId, key);
    if (tenantVal !== null && tenantVal !== undefined) return tenantVal as T;

    const globalVal = await this.configurationService.getSettingByKey(key);
    if (globalVal !== null && globalVal !== undefined) return globalVal as T;

    return defaultValue;
  }

  /**
   * Get complete aggregated configuration view for a given tenant/store scope.
   */
  public async getResolvedConfiguration(
    tenantId: number,
    storeId: number | null
  ): Promise<Record<string, any>> {
    const globalSettings = await this.configurationService.getGlobalConfiguration();
    const tenantSettings = await this.tenantSettingsService.getTenantSettings(tenantId);
    const storeSettings = storeId
      ? await this.storeSettingsService.getStoreSettings(tenantId, storeId)
      : {};

    return {
      ...globalSettings,
      ...tenantSettings,
      ...storeSettings,
    };
  }
}
