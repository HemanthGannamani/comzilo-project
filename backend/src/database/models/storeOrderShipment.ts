/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class StoreOrderShipment extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare orderId: number;
  declare carrier: string;
  declare trackingNumber: string;
  declare trackingUrl: string | null;
  declare shippingCost: number;
  declare status: string;
  declare shippedAt: Date | null;
  declare deliveredAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

StoreOrderShipment.init(
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
    carrier: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    trackingNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'tracking_number',
    },
    trackingUrl: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      field: 'tracking_url',
    },
    shippingCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      field: 'shipping_cost',
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'pending',
    },
    shippedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'shipped_at',
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'delivered_at',
    },
  },
  {
    sequelize,
    modelName: 'StoreOrderShipment',
    tableName: 'order_shipments',
    timestamps: true,
    underscored: true,
  }
);
