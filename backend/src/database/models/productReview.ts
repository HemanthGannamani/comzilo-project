import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class ProductReview extends Model {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare productId: number;
  declare customerId: number | null;
  declare userId: number | null;
  declare customerName: string;
  declare customerEmail: string | null;
  declare rating: number;
  declare title: string | null;
  declare comment: string;
  declare verifiedPurchase: boolean;
  declare status: string;
  declare helpfulCount: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ProductReview.init(
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
      defaultValue: 1,
      field: 'tenant_id',
    },
    storeId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      field: 'store_id',
    },
    productId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'product_id',
    },
    customerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'customer_id',
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'user_id',
    },
    customerName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'customer_name',
    },
    customerEmail: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'customer_email',
    },
    rating: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 5,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    verifiedPurchase: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'verified_purchase',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'approved',
    },
    helpfulCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'helpful_count',
    },
  },
  {
    sequelize,
    tableName: 'product_reviews',
    timestamps: true,
    underscored: true,
  }
);
