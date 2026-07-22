/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class WishlistItem extends Model<any, any> {
  declare id: number;
  declare wishlistId: number;
  declare productId: number;
  declare variantId: number | null;
  declare addedPrice: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

WishlistItem.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    wishlistId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'wishlist_id',
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
    addedPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'added_price',
    },
  },
  {
    sequelize,
    modelName: 'WishlistItem',
    tableName: 'wishlist_items',
    timestamps: true,
    underscored: true,
  }
);
