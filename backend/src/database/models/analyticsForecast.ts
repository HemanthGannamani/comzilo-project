/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class AnalyticsForecast extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare forecastType: string;
  declare forecastJson: any;
  declare accuracyScore: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

AnalyticsForecast.init(
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
    forecastType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'forecast_type',
    },
    forecastJson: {
      type: DataTypes.JSON,
      allowNull: false,
      field: 'forecast_json',
    },
    accuracyScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 95.0,
      field: 'accuracy_score',
    },
  },
  {
    sequelize,
    modelName: 'AnalyticsForecast',
    tableName: 'analytics_forecasts',
    timestamps: true,
    underscored: true,
  }
);
