/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class GoodsReceipt extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare poId: number;
  declare warehouseId: number;
  declare grnNumber: string;
  declare receivedAt: Date;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

GoodsReceipt.init(
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
    poId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'po_id',
    },
    warehouseId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      field: 'warehouse_id',
    },
    grnNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'grn_number',
    },
    receivedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'received_at',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'received',
    },
  },
  {
    sequelize,
    modelName: 'GoodsReceipt',
    tableName: 'goods_receipts',
    timestamps: true,
    underscored: true,
  }
);
