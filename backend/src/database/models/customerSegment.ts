/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class CustomerSegment extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare name: string;
  declare code: string;
  declare criteriaRules: any;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CustomerSegment.init(
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
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    criteriaRules: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'criteria_rules',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'CustomerSegment',
    tableName: 'customer_segments',
    timestamps: true,
    underscored: true,
  }
);
