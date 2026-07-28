/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class Plan extends Model<any, any> {
  declare id: number;
  declare code: string;
  declare name: string;
  declare description: string | null;
  declare priceMonthly: number;
  declare priceYearly: number;
  declare currency: string;
  declare trialDays: number;
  declare storeLimit: number;
  declare userLimit: number;
  declare warehouseLimit: number;
  declare features: any;
  declare sortOrder: number;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Plan.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priceMonthly: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'price_monthly',
    },
    priceYearly: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'price_yearly',
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'INR',
    },
    trialDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'trial_days',
    },
    storeLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'store_limit',
    },
    userLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
      field: 'user_limit',
    },
    warehouseLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'warehouse_limit',
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    tableName: 'plans',
    underscored: true,
    timestamps: true,
  }
);
