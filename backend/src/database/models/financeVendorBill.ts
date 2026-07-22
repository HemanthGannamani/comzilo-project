/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class FinanceVendorBill extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare supplierId: number;
  declare billNumber: string;
  declare totalAmount: number;
  declare dueDate: string;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

FinanceVendorBill.init(
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
    supplierId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'supplier_id',
    },
    billNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'bill_number',
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
    modelName: 'FinanceVendorBill',
    tableName: 'finance_vendor_bills',
    timestamps: true,
    underscored: true,
  }
);
