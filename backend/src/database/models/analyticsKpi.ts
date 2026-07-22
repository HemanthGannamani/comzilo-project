/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class AnalyticsKpi extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare kpiKey: string;
  declare kpiName: string;
  declare currentValue: number;
  declare targetValue: number | null;
  declare unit: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

AnalyticsKpi.init(
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
    kpiKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'kpi_key',
    },
    kpiName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'kpi_name',
    },
    currentValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
      field: 'current_value',
    },
    targetValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'target_value',
    },
    unit: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'currency',
    },
  },
  {
    sequelize,
    modelName: 'AnalyticsKpi',
    tableName: 'analytics_kpis',
    timestamps: true,
    underscored: true,
  }
);
