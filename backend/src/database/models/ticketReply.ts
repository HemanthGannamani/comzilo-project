/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class TicketReply extends Model<any, any> {
  declare id: number;
  declare ticketId: number;
  declare userId: number | null;
  declare message: string;
  declare isStaffReply: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

TicketReply.init(
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
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'user_id',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isStaffReply: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_staff_reply',
    },
  },
  {
    sequelize,
    modelName: 'TicketReply',
    tableName: 'ticket_replies',
    timestamps: true,
    underscored: true,
  }
);
