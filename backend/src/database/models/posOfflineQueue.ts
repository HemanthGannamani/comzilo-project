/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class PosOfflineQueue extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare offlineGuid: string;
  declare payloadJson: any;
  declare status: string;
  declare errorMessage: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PosOfflineQueue.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tenantId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'tenant_id',
    },
    storeId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'store_id',
    },
    offlineGuid: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'offline_guid',
    },
    payloadJson: {
      type: DataTypes.JSON,
      allowNull: false,
      field: 'payload_json',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'error_message',
    },
  },
  {
    sequelize,
    modelName: 'PosOfflineQueue',
    tableName: 'pos_offline_queue',
    timestamps: true,
    underscored: true,
  }
);
