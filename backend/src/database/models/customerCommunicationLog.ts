/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class CustomerCommunicationLog extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare customerId: number;
  declare channel: string;
  declare subject: string | null;
  declare messageBody: string;
  declare sentAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CustomerCommunicationLog.init(
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
    channel: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    messageBody: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'message_body',
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'sent_at',
    },
  },
  {
    sequelize,
    modelName: 'CustomerCommunicationLog',
    tableName: 'customer_communication_logs',
    timestamps: true,
    underscored: true,
  }
);
