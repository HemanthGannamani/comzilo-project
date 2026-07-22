/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class PurchaseOrder extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare supplierId: number;
  declare warehouseId: number;
  declare poNumber: string;
  declare subtotal: number;
  declare taxAmount: number;
  declare totalAmount: number;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PurchaseOrder.init(
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
    warehouseId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      field: 'warehouse_id',
    },
    poNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'po_number',
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
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_amount',
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'approved',
    },
  },
  {
    sequelize,
    modelName: 'PurchaseOrder',
    tableName: 'purchase_orders',
    timestamps: true,
    underscored: true,
  }
);
