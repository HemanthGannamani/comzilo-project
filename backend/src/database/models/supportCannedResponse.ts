/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class SupportCannedResponse extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare title: string;
  declare shortcut: string;
  declare content: string;
  declare category: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

SupportCannedResponse.init(
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
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    shortcut: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'General',
    },
  },
  {
    sequelize,
    modelName: 'SupportCannedResponse',
    tableName: 'support_canned_responses',
    timestamps: true,
    underscored: true,
  }
);
