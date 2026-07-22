/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class FinanceJournalEntry extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare entryNumber: string;
  declare entryDate: string;
  declare description: string;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

FinanceJournalEntry.init(
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
    entryNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'entry_number',
    },
    entryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'entry_date',
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'posted',
    },
  },
  {
    sequelize,
    modelName: 'FinanceJournalEntry',
    tableName: 'finance_journal_entries',
    timestamps: true,
    underscored: true,
  }
);
