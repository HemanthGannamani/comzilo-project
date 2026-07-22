/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class SupportTicket extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare customerId: number;
  declare ticketNumber: string;
  declare subject: string;
  declare priority: string;
  declare status: string;
  declare category: string | null;
  declare assignedTo: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

SupportTicket.init(
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
    ticketNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'ticket_number',
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    priority: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'medium',
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'open',
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    assignedTo: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'assigned_to',
    },
  },
  {
    sequelize,
    modelName: 'SupportTicket',
    tableName: 'support_tickets',
    timestamps: true,
    underscored: true,
  }
);
