/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class StoreOrderStatusHistory extends Model<any, any> {
  declare id: number;
  declare orderId: number;
  declare previousStatus: string | null;
  declare newStatus: string;
  declare comment: string | null;
  declare createdBy: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

StoreOrderStatusHistory.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'order_id',
    },
    previousStatus: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'previous_status',
    },
    newStatus: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'new_status',
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'created_by',
    },
  },
  {
    sequelize,
    modelName: 'StoreOrderStatusHistory',
    tableName: 'order_status_history',
    timestamps: true,
    underscored: true,
  }
);
