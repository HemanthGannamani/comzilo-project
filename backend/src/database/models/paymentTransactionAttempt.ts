/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class PaymentTransactionAttempt extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare paymentId: number;
  declare attemptNumber: number;
  declare status: string;
  declare failureReason: string | null;
  declare gatewayResponse: any;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PaymentTransactionAttempt.init(
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
    paymentId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'payment_id',
    },
    attemptNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'attempt_number',
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    failureReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'failure_reason',
    },
    gatewayResponse: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'gateway_response',
    },
  },
  {
    sequelize,
    modelName: 'PaymentTransactionAttempt',
    tableName: 'payment_transaction_attempts',
    timestamps: true,
    underscored: true,
  }
);
