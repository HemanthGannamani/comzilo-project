/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class FinanceJournalLine extends Model<any, any> {
  declare id: number;
  declare entryId: number;
  declare accountId: number;
  declare debitAmount: number;
  declare creditAmount: number;
  declare memo: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

FinanceJournalLine.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    entryId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'entry_id',
    },
    accountId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'account_id',
    },
    debitAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
      field: 'debit_amount',
    },
    creditAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
      field: 'credit_amount',
    },
    memo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'FinanceJournalLine',
    tableName: 'finance_journal_lines',
    timestamps: true,
    underscored: true,
  }
);
