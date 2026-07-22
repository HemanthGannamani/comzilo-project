/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class FinanceGeneralLedger extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare accountId: number;
  declare entryId: number;
  declare postingDate: string;
  declare debit: number;
  declare credit: number;
  declare runningBalance: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

FinanceGeneralLedger.init(
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
    accountId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'account_id',
    },
    entryId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'entry_id',
    },
    postingDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'posting_date',
    },
    debit: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    credit: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    runningBalance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
      field: 'running_balance',
    },
  },
  {
    sequelize,
    modelName: 'FinanceGeneralLedger',
    tableName: 'finance_general_ledger',
    timestamps: true,
    underscored: true,
  }
);
