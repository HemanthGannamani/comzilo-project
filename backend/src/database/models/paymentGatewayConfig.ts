/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class PaymentGatewayConfig extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare name: string;
  declare code: string;
  declare apiKeyEncrypted: string | null;
  declare secretKeyEncrypted: string | null;
  declare webhookSecret: string | null;
  declare isSandbox: boolean;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PaymentGatewayConfig.init(
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apiKeyEncrypted: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'api_key_encrypted',
    },
    secretKeyEncrypted: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'secret_key_encrypted',
    },
    webhookSecret: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'webhook_secret',
    },
    isSandbox: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_sandbox',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'PaymentGatewayConfig',
    tableName: 'payment_gateways',
    timestamps: true,
    underscored: true,
  }
);
