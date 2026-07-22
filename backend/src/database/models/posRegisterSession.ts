/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class PosRegisterSession extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare registerId: number;
  declare cashierUserId: number;
  declare openingCash: number;
  declare closingCash: number | null;
  declare expectedCash: number | null;
  declare cashDifference: number | null;
  declare status: string;
  declare openedAt: Date;
  declare closedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PosRegisterSession.init(
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
    registerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'register_id',
    },
    cashierUserId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'cashier_user_id',
    },
    openingCash: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      field: 'opening_cash',
    },
    closingCash: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'closing_cash',
    },
    expectedCash: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'expected_cash',
    },
    cashDifference: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'cash_difference',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'open',
    },
    openedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'opened_at',
    },
    closedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'closed_at',
    },
  },
  {
    sequelize,
    modelName: 'PosRegisterSession',
    tableName: 'pos_register_sessions',
    timestamps: true,
    underscored: true,
  }
);
