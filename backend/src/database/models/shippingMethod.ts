/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class ShippingMethod extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare zoneId: number;
  declare name: string;
  declare code: string;
  declare type: string;
  declare rate: number;
  declare estimatedDays: number | null;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ShippingMethod.init(
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
    zoneId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'zone_id',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'standard',
    },
    rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    estimatedDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'estimated_days',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'ShippingMethod',
    tableName: 'shipping_methods',
    timestamps: true,
    underscored: true,
  }
);
