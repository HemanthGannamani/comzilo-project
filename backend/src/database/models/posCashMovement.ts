/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class PosCashMovement extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare sessionId: number;
  declare movementType: string;
  declare amount: number;
  declare reason: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PosCashMovement.init(
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
    sessionId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'session_id',
    },
    movementType: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: 'movement_type',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'PosCashMovement',
    tableName: 'pos_cash_movements',
    timestamps: true,
    underscored: true,
  }
);
