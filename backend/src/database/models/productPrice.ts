/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class ProductPrice extends Model<any, any> {
  declare id: number;
  declare productId: number;
  declare regularPrice: number;
  declare salePrice: number | null;
  declare costPrice: number | null;
  declare currency: string;
  declare effectiveFrom: Date | null;
  declare effectiveTo: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

ProductPrice.init(
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
    regularPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      field: 'regular_price',
    },
    salePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'sale_price',
    },
    costPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'cost_price',
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'USD',
    },
    effectiveFrom: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'effective_from',
    },
    effectiveTo: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'effective_to',
    },
  },
  {
    sequelize,
    modelName: 'ProductPrice',
    tableName: 'product_prices',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
