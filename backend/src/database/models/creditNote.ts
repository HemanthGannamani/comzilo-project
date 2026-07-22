/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class CreditNote extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare orderId: number;
  declare creditNoteNumber: string;
  declare amount: number;
  declare reason: string | null;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CreditNote.init(
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
    creditNoteNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'credit_note_number',
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'issued',
    },
  },
  {
    sequelize,
    modelName: 'CreditNote',
    tableName: 'credit_notes',
    timestamps: true,
    underscored: true,
  }
);
