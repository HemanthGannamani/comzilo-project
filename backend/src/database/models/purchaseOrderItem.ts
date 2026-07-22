/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class PurchaseOrderItem extends Model<any, any> {
  declare id: number;
  declare poId: number;
  declare productId: number;
  declare variantId: number | null;
  declare quantityOrdered: number;
  declare unitCost: number;
  declare subtotal: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PurchaseOrderItem.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    poId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'po_id',
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
    quantityOrdered: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'quantity_ordered',
    },
    unitCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'unit_cost',
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'PurchaseOrderItem',
    tableName: 'purchase_order_items',
    timestamps: true,
    underscored: true,
  }
);
