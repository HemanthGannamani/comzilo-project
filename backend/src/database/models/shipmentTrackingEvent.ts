/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class ShipmentTrackingEvent extends Model<any, any> {
  declare id: number;
  declare shipmentId: number;
  declare eventType: string;
  declare status: string;
  declare location: string | null;
  declare description: string | null;
  declare eventTime: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ShipmentTrackingEvent.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    shipmentId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'shipment_id',
    },
    eventType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'event_type',
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    eventTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'event_time',
    },
  },
  {
    sequelize,
    modelName: 'ShipmentTrackingEvent',
    tableName: 'shipment_tracking_events',
    timestamps: true,
    underscored: true,
  }
);
