/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class FinanceBankReconciliation extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare bankAccountId: number;
  declare statementDate: string;
  declare endingBalance: number;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

FinanceBankReconciliation.init(
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
    bankAccountId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'bank_account_id',
    },
    statementDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'statement_date',
    },
    endingBalance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'ending_balance',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'reconciled',
    },
  },
  {
    sequelize,
    modelName: 'FinanceBankReconciliation',
    tableName: 'finance_bank_reconciliations',
    timestamps: true,
    underscored: true,
  }
);
