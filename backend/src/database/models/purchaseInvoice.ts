/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class PurchaseInvoice extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare supplierId: number;
  declare poId: number | null;
  declare invoiceNumber: string;
  declare totalAmount: number;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PurchaseInvoice.init(
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
    poId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'po_id',
    },
    invoiceNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'invoice_number',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_amount',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'unpaid',
    },
  },
  {
    sequelize,
    modelName: 'PurchaseInvoice',
    tableName: 'purchase_invoices',
    timestamps: true,
    underscored: true,
  }
);
