/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class GiftCard extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare giftCardNumber: string;
  declare initialValue: number;
  declare remainingBalance: number;
  declare expiryDate: string | null;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

GiftCard.init(
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
    giftCardNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'gift_card_number',
    },
    initialValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'initial_value',
    },
    remainingBalance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'remaining_balance',
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'expiry_date',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'GiftCard',
    tableName: 'gift_cards',
    timestamps: true,
    underscored: true,
  }
);
