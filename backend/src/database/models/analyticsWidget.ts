/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class AnalyticsWidget extends Model<any, any> {
  declare id: number;
  declare dashboardId: number;
  declare widgetType: string;
  declare dataSource: string;
  declare settings: any;
  declare sortOrder: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

AnalyticsWidget.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    dashboardId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'dashboard_id',
    },
    widgetType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'widget_type',
    },
    dataSource: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'data_source',
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
  },
  {
    sequelize,
    modelName: 'AnalyticsWidget',
    tableName: 'analytics_widgets',
    timestamps: true,
    underscored: true,
  }
);
