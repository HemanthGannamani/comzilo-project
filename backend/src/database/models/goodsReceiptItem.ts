/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class GoodsReceiptItem extends Model<any, any> {
  declare id: number;
  declare grnId: number;
  declare productId: number;
  declare variantId: number | null;
  declare quantityReceived: number;
  declare batchNumber: string | null;
  declare expiryDate: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

GoodsReceiptItem.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    grnId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'grn_id',
    },
    productId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'product_id',
    },
    variantId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'variant_id',
    },
    quantityReceived: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'quantity_received',
    },
    batchNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'batch_number',
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'expiry_date',
    },
  },
  {
    sequelize,
    modelName: 'GoodsReceiptItem',
    tableName: 'goods_receipt_items',
    timestamps: true,
    underscored: true,
  }
);
