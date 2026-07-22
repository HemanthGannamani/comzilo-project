import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface IntegrationSyncLogAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number | null;
  integrationId: number;
  syncType: 'orders' | 'inventory' | 'customers' | 'products';
  status: 'success' | 'failed' | 'partial';
  recordsSynced: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorDetails: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IntegrationSyncLogCreationAttributes = Optional<
  IntegrationSyncLogAttributes,
  'id' | 'uuid' | 'storeId' | 'recordsSynced' | 'errorDetails'
>;

export class IntegrationSyncLog
  extends Model<IntegrationSyncLogAttributes, IntegrationSyncLogCreationAttributes>
  implements IntegrationSyncLogAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number | null;
  declare integrationId: number;
  declare syncType: 'orders' | 'inventory' | 'customers' | 'products';
  declare status: 'success' | 'failed' | 'partial';
  declare recordsSynced: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare errorDetails: any;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

IntegrationSyncLog.init(
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
    integrationId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'integration_id',
    },
    syncType: {
      type: DataTypes.ENUM('orders', 'inventory', 'customers', 'products'),
      allowNull: false,
      field: 'sync_type',
    },
    status: {
      type: DataTypes.ENUM('success', 'failed', 'partial'),
      allowNull: false,
    },
    recordsSynced: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'records_synced',
    },
    errorDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'error_details',
    },
  },
  {
    sequelize,
    tableName: 'integration_sync_logs',
    timestamps: true,
    underscored: true,
  }
);
