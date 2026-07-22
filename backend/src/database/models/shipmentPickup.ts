/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class ShipmentPickup extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare warehouseId: number;
  declare carrierId: number;
  declare pickupNumber: string;
  declare pickupDate: string;
  declare pickupTime: string | null;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ShipmentPickup.init(
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
    carrierId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'carrier_id',
    },
    pickupNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'pickup_number',
    },
    pickupDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'pickup_date',
    },
    pickupTime: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'pickup_time',
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'scheduled',
    },
  },
  {
    sequelize,
    modelName: 'ShipmentPickup',
    tableName: 'shipment_pickups',
    timestamps: true,
    underscored: true,
  }
);
