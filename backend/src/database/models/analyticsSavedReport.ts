/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class AnalyticsSavedReport extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare name: string;
  declare reportType: string;
  declare filters: any;
  declare fields: any;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

AnalyticsSavedReport.init(
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    reportType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'report_type',
    },
    filters: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    fields: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'AnalyticsSavedReport',
    tableName: 'analytics_saved_reports',
    timestamps: true,
    underscored: true,
  }
);
