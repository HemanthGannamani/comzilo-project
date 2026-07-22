/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class PosReturn extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare saleId: number;
  declare returnNumber: string;
  declare refundAmount: number;
  declare refundMethod: string;
  declare reason: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PosReturn.init(
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
    saleId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'sale_id',
    },
    returnNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'return_number',
    },
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'refund_amount',
    },
    refundMethod: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'refund_method',
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'PosReturn',
    tableName: 'pos_returns',
    timestamps: true,
    underscored: true,
  }
);
