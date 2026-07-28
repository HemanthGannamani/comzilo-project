/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class TicketInternalNote extends Model<any, any> {
  declare id: number;
  declare ticketId: number;
  declare staffUserId: number;
  declare staffName: string;
  declare note: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

TicketInternalNote.init(
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
    staffUserId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'staff_user_id',
    },
    staffName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'staff_name',
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'TicketInternalNote',
    tableName: 'ticket_internal_notes',
    timestamps: true,
    underscored: true,
  }
);
