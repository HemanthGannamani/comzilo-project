/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class StoreOrderReturn extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare orderId: number;
  declare returnNumber: string;
  declare reason: string;
  declare status: string;
  declare restockInventory: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

StoreOrderReturn.init(
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
    orderId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'order_id',
    },
    returnNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'return_number',
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'requested',
    },
    restockInventory: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'restock_inventory',
    },
  },
  {
    sequelize,
    modelName: 'StoreOrderReturn',
    tableName: 'order_returns',
    timestamps: true,
    underscored: true,
  }
);
