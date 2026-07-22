/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class SupplierReturn extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare grnId: number;
  declare returnNumber: string;
  declare refundAmount: number;
  declare reason: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

SupplierReturn.init(
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
    grnId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'grn_id',
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
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'SupplierReturn',
    tableName: 'supplier_returns',
    timestamps: true,
    underscored: true,
  }
);
