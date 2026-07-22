/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class ProductShipping extends Model<any, any> {
  declare id: number;
  declare productId: number;
  declare weight: number | null;
  declare length: number | null;
  declare width: number | null;
  declare height: number | null;
  declare shippingClass: string | null;
  declare packageType: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

ProductShipping.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    productId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'product_id',
    },
    weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    length: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    width: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    height: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    shippingClass: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'shipping_class',
    },
    packageType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'package_type',
    },
  },
  {
    sequelize,
    modelName: 'ProductShipping',
    tableName: 'product_shipping',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
