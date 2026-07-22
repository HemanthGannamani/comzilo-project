/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class InventoryCycleCount extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare warehouseId: number;
  declare countNumber: string;
  declare status: string;
  declare notes: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

InventoryCycleCount.init(
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
    warehouseId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'warehouse_id',
    },
    countNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'count_number',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'scheduled',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'InventoryCycleCount',
    tableName: 'inventory_cycle_counts',
    timestamps: true,
    underscored: true,
  }
);
