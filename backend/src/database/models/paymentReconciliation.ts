/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class PaymentReconciliation extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare periodStart: string;
  declare periodEnd: string;
  declare totalOrders: number;
  declare totalCaptured: number;
  declare totalSettled: number;
  declare mismatchCount: number;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PaymentReconciliation.init(
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
    periodStart: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'period_start',
    },
    periodEnd: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'period_end',
    },
    totalOrders: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_orders',
    },
    totalCaptured: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
      field: 'total_captured',
    },
    totalSettled: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
      field: 'total_settled',
    },
    mismatchCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'mismatch_count',
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'matched',
    },
  },
  {
    sequelize,
    modelName: 'PaymentReconciliation',
    tableName: 'payment_reconciliation',
    timestamps: true,
    underscored: true,
  }
);
