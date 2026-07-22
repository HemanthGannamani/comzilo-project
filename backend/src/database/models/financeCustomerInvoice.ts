/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class FinanceCustomerInvoice extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare customerId: number;
  declare invoiceNumber: string;
  declare totalAmount: number;
  declare dueDate: string;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

FinanceCustomerInvoice.init(
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
    invoiceNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'invoice_number',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'total_amount',
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'due_date',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'unpaid',
    },
  },
  {
    sequelize,
    modelName: 'FinanceCustomerInvoice',
    tableName: 'finance_customer_invoices',
    timestamps: true,
    underscored: true,
  }
);
