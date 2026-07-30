/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class SellerBankAccount extends Model<any, any> {
  declare id: number;
  declare sellerId: number | null;
  declare tenantId: number;
  declare storeId: number | null;
  declare accountHolderName: string;
  declare bankName: string;
  declare accountNumber: string;
  declare ifscCode: string;
  declare upiId: string | null;
  declare panNumber: string;
  declare gstNumber: string | null;
  declare cancelledChequeUrl: string | null;
  declare passbookUrl: string | null;
  declare status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NEEDS_CHANGES';
  declare remarks: string | null;
  declare verifiedBy: number | null;
  declare verifiedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

SellerBankAccount.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    sellerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'seller_id',
    },
    tenantId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'tenant_id',
    },
    storeId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'store_id',
    },
    accountHolderName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'account_holder_name',
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
      allowNull: false,
      field: 'ifsc_code',
    },
    upiId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'upi_id',
    },
    panNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'pan_number',
    },
    gstNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'gst_number',
    },
    cancelledChequeUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cancelled_cheque_url',
    },
    passbookUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'passbook_url',
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'VERIFIED', 'REJECTED', 'NEEDS_CHANGES'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    verifiedBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'verified_by',
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'verified_at',
    },
  },
  {
    sequelize,
    tableName: 'seller_bank_accounts',
    underscored: true,
    timestamps: true,
  }
);
