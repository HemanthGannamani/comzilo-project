/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class TicketMessage extends Model<any, any> {
  declare id: number;
  declare ticketId: number;
  declare senderType: 'customer' | 'ai_assistant' | 'seller_staff';
  declare senderId: number | null;
  declare senderName: string | null;
  declare message: string;
  declare isInternal: boolean;
  declare metadata: any;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

TicketMessage.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ticketId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'ticket_id',
    },
    senderType: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'customer',
      field: 'sender_type',
    },
    senderId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'sender_id',
    },
    senderName: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'sender_name',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isInternal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_internal',
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'TicketMessage',
    tableName: 'ticket_messages',
    timestamps: true,
    underscored: true,
  }
);
