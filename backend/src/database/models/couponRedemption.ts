/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class CouponRedemption extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare couponId: number;
  declare customerId: number;
  declare orderId: number;
  declare discountAmount: number;
  declare redeemedAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CouponRedemption.init(
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
    couponId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'coupon_id',
    },
    customerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'customer_id',
    },
    orderId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'order_id',
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'discount_amount',
    },
    redeemedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'redeemed_at',
    },
  },
  {
    sequelize,
    modelName: 'CouponRedemption',
    tableName: 'coupon_redemptions',
    timestamps: true,
    underscored: true,
  }
);
