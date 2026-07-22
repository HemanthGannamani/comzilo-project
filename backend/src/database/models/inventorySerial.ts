/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class InventorySerial extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare warehouseId: number;
  declare serialNumber: string;
  declare imei: string | null;
  declare activationStatus: string;
  declare warrantyExpiry: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

InventorySerial.init(
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
    serialNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'serial_number',
    },
    imei: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    activationStatus: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'inactive',
      field: 'activation_status',
    },
    warrantyExpiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'warranty_expiry',
    },
  },
  {
    sequelize,
    modelName: 'InventorySerial',
    tableName: 'inventory_serials',
    timestamps: true,
    underscored: true,
  }
);
