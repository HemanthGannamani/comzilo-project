/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class CustomerWishlist extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare customerId: number;
  declare name: string;
  declare isPublic: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CustomerWishlist.init(
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
    customerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'customer_id',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'My Wishlist',
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_public',
    },
  },
  {
    sequelize,
    modelName: 'CustomerWishlist',
    tableName: 'customer_wishlists',
    timestamps: true,
    underscored: true,
  }
);
