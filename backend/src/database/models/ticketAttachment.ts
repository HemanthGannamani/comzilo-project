/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class TicketAttachment extends Model<any, any> {
  declare id: number;
  declare ticketId: number;
  declare messageId: number | null;
  declare fileName: string;
  declare fileUrl: string;
  declare fileType: string;
  declare fileSize: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

TicketAttachment.init(
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
    messageId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'message_id',
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'file_name',
    },
    fileUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'file_url',
    },
    fileType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'image/png',
      field: 'file_type',
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'file_size',
    },
  },
  {
    sequelize,
    modelName: 'TicketAttachment',
    tableName: 'ticket_attachments',
    timestamps: true,
    underscored: true,
  }
);
