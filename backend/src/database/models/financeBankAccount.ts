/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class FinanceBankAccount extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare bankName: string;
  declare accountNumber: string;
  declare balance: number;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

FinanceBankAccount.init(
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
    bankName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'bank_name',
    },
    accountNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'account_number',
    },
    balance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'FinanceBankAccount',
    tableName: 'finance_bank_accounts',
    timestamps: true,
    underscored: true,
  }
);
