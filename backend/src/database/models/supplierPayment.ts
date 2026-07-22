/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class SupplierPayment extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare invoiceId: number;
  declare paymentMethod: string;
  declare amountPaid: number;
  declare paidAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

SupplierPayment.init(
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
    invoiceId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'invoice_id',
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'payment_method',
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'amount_paid',
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'paid_at',
    },
  },
  {
    sequelize,
    modelName: 'SupplierPayment',
    tableName: 'supplier_payments',
    timestamps: true,
    underscored: true,
  }
);
