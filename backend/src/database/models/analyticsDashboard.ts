/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class AnalyticsDashboard extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare name: string;
  declare isDefault: boolean;
  declare layoutConfig: any;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

AnalyticsDashboard.init(
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
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_default',
    },
    layoutConfig: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'layout_config',
    },
  },
  {
    sequelize,
    modelName: 'AnalyticsDashboard',
    tableName: 'analytics_dashboards',
    timestamps: true,
    underscored: true,
  }
);
