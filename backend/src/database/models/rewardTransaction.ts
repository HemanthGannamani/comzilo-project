/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class RewardTransaction extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare loyaltyAccountId: number;
  declare transactionType: string;
  declare points: number;
  declare reference: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

RewardTransaction.init(
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
    loyaltyAccountId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'loyalty_account_id',
    },
    transactionType: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: 'transaction_type',
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'RewardTransaction',
    tableName: 'reward_transactions',
    timestamps: true,
    underscored: true,
  }
);
