/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class PosSalePayment extends Model<any, any> {
  declare id: number;
  declare saleId: number;
  declare paymentMethod: string;
  declare amountPaid: number;
  declare changeGiven: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PosSalePayment.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    saleId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'sale_id',
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'payment_method',
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'amount_paid',
    },
    changeGiven: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      field: 'change_given',
    },
  },
  {
    sequelize,
    modelName: 'PosSalePayment',
    tableName: 'pos_sale_payments',
    timestamps: true,
    underscored: true,
  }
);
