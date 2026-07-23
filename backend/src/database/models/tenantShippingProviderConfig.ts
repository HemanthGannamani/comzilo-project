import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';
import { encryptCredential, decryptCredential } from '../../utils/encryption';

export class TenantShippingProviderConfig extends Model {
  public id!: number;
  public tenantId!: number;
  public storeId?: number;
  public providerId!: number;
  public providerCode!: string;
  public isEnabled!: boolean;
  public apiKey?: string;
  public apiSecret?: string;
  public webhookUrl?: string;
  public webhookSecret?: string;
  public environment!: 'sandbox' | 'production';
  public pickupAddress?: any;
  public defaultCourier?: string;
  public isCodEnabled!: boolean;
  public isTrackingEnabled!: boolean;
  public autoShipment!: boolean;
  public autoPickup!: boolean;
  public autoAwb!: boolean;
  public autoSyncTracking!: boolean;
  public shippingChargesConfig?: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TenantShippingProviderConfig.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    tenantId: {
      type: DataTypes.BIGINT.UNSIGNED,
      field: 'tenant_id',
      allowNull: false,
    },
    storeId: {
      type: DataTypes.BIGINT.UNSIGNED,
      field: 'store_id',
      allowNull: true,
    },
    providerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      field: 'provider_id',
      allowNull: false,
    },
    providerCode: {
      type: DataTypes.STRING(50),
      field: 'provider_code',
      allowNull: false,
    },
    isEnabled: {
      type: DataTypes.BOOLEAN,
      field: 'is_enabled',
      allowNull: false,
      defaultValue: false,
    },
    apiKey: {
      type: DataTypes.TEXT,
      field: 'api_key',
      allowNull: true,
      get() {
        const raw = this.getDataValue('apiKey');
        return decryptCredential(raw);
      },
      set(value: string | null) {
        this.setDataValue('apiKey', encryptCredential(value));
      },
    },
    apiSecret: {
      type: DataTypes.TEXT,
      field: 'api_secret',
      allowNull: true,
      get() {
        const raw = this.getDataValue('apiSecret');
        return decryptCredential(raw);
      },
      set(value: string | null) {
        this.setDataValue('apiSecret', encryptCredential(value));
      },
    },
    webhookUrl: {
      type: DataTypes.STRING(255),
      field: 'webhook_url',
      allowNull: true,
    },
    webhookSecret: {
      type: DataTypes.TEXT,
      field: 'webhook_secret',
      allowNull: true,
      get() {
        const raw = this.getDataValue('webhookSecret');
        return decryptCredential(raw);
      },
      set(value: string | null) {
        this.setDataValue('webhookSecret', encryptCredential(value));
      },
    },
    pickupAddress: {
      type: DataTypes.JSON,
      field: 'pickup_address',
      allowNull: true,
    },
    defaultCourier: {
      type: DataTypes.STRING(100),
      field: 'default_courier',
      allowNull: true,
    },
    isCodEnabled: {
      type: DataTypes.BOOLEAN,
      field: 'is_cod_enabled',
      allowNull: false,
      defaultValue: true,
    },
    isTrackingEnabled: {
      type: DataTypes.BOOLEAN,
      field: 'is_tracking_enabled',
      allowNull: false,
      defaultValue: true,
    },
    shippingChargesConfig: {
      type: DataTypes.JSON,
      field: 'shipping_charges_config',
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'tenant_shipping_provider_configs',
    timestamps: true,
    underscored: true,
  }
);

export default TenantShippingProviderConfig;
