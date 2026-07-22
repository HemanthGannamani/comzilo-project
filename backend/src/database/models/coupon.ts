/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class Coupon extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare promotionId: number | null;
  declare code: string;
  declare usageLimit: number | null;
  declare usedCount: number;
  declare perCustomerLimit: number;
  declare minOrderAmount: number | null;
  declare maxDiscountAmount: number | null;
  declare expiryDate: Date | null;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Coupon.init(
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
    promotionId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'promotion_id',
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    usageLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'usage_limit',
    },
    usedCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'used_count',
    },
    perCustomerLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'per_customer_limit',
    },
    minOrderAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'min_order_amount',
    },
    maxDiscountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'max_discount_amount',
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expiry_date',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'Coupon',
    tableName: 'coupons',
    timestamps: true,
    underscored: true,
  }
);
