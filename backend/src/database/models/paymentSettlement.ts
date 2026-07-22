/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class PaymentSettlement extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare gatewayCode: string;
  declare settlementNumber: string;
  declare settlementDate: string;
  declare grossAmount: number;
  declare gatewayFees: number;
  declare taxAmount: number;
  declare netAmount: number;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PaymentSettlement.init(
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
    gatewayCode: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'gateway_code',
    },
    settlementNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'settlement_number',
    },
    settlementDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'settlement_date',
    },
    grossAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
      field: 'gross_amount',
    },
    gatewayFees: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
      field: 'gateway_fees',
    },
    taxAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
      field: 'tax_amount',
    },
    netAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
      field: 'net_amount',
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'settled',
    },
  },
  {
    sequelize,
    modelName: 'PaymentSettlement',
    tableName: 'payment_settlements',
    timestamps: true,
    underscored: true,
  }
);
