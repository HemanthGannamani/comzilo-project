/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class PosSale extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare sessionId: number;
  declare orderId: number | null;
  declare customerId: number | null;
  declare saleNumber: string;
  declare subtotal: number;
  declare taxAmount: number;
  declare discountAmount: number;
  declare totalAmount: number;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PosSale.init(
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
    sessionId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'session_id',
    },
    orderId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'order_id',
    },
    customerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'customer_id',
    },
    saleNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'sale_number',
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      field: 'tax_amount',
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      field: 'discount_amount',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_amount',
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'completed',
    },
  },
  {
    sequelize,
    modelName: 'PosSale',
    tableName: 'pos_sales',
    timestamps: true,
    underscored: true,
  }
);
