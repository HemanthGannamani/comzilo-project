import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface IntegrationAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number | null;
  provider: 'shopify' | 'woocommerce' | 'stripe' | 'quickbooks' | 'zapier' | 'custom';
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any;
  status: 'connected' | 'disconnected' | 'error';
  lastSyncedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type IntegrationCreationAttributes = Optional<
  IntegrationAttributes,
  'id' | 'uuid' | 'storeId' | 'config' | 'status' | 'lastSyncedAt'
>;

export class Integration
  extends Model<IntegrationAttributes, IntegrationCreationAttributes>
  implements IntegrationAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number | null;
  declare provider: 'shopify' | 'woocommerce' | 'stripe' | 'quickbooks' | 'zapier' | 'custom';
  declare name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare config: any;
  declare status: 'connected' | 'disconnected' | 'error';
  declare lastSyncedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Integration.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    tenantId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'tenant_id',
    },
    storeId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'store_id',
    },
    provider: {
      type: DataTypes.ENUM('shopify', 'woocommerce', 'stripe', 'quickbooks', 'zapier', 'custom'),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    config: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('connected', 'disconnected', 'error'),
      allowNull: false,
      defaultValue: 'connected',
    },
    lastSyncedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_synced_at',
    },
  },
  {
    sequelize,
    tableName: 'integrations',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
