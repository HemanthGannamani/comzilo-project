/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class PosSaleItem extends Model<any, any> {
  declare id: number;
  declare saleId: number;
  declare productId: number;
  declare variantId: number | null;
  declare barcode: string | null;
  declare quantity: number;
  declare unitPrice: number;
  declare subtotal: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PosSaleItem.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    saleId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'sale_id',
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
    barcode: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'unit_price',
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'PosSaleItem',
    tableName: 'pos_sale_items',
    timestamps: true,
    underscored: true,
  }
);
