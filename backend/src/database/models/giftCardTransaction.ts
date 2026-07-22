/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class GiftCardTransaction extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare giftCardId: number;
  declare orderId: number | null;
  declare transactionType: string;
  declare amount: number;
  declare balanceAfter: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

GiftCardTransaction.init(
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
    giftCardId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'gift_card_id',
    },
    orderId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'order_id',
    },
    transactionType: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: 'transaction_type',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    balanceAfter: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'balance_after',
    },
  },
  {
    sequelize,
    modelName: 'GiftCardTransaction',
    tableName: 'gift_card_transactions',
    timestamps: true,
    underscored: true,
  }
);
