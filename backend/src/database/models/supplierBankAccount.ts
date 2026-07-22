/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class SupplierBankAccount extends Model<any, any> {
  declare id: number;
  declare supplierId: number;
  declare bankName: string;
  declare accountNumber: string;
  declare ifscCode: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

SupplierBankAccount.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    supplierId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'supplier_id',
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
    ifscCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'ifsc_code',
    },
  },
  {
    sequelize,
    modelName: 'SupplierBankAccount',
    tableName: 'supplier_bank_accounts',
    timestamps: true,
    underscored: true,
  }
);
