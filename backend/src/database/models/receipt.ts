import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface ReceiptAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number;
  orderId: number;
  posSessionId: number;
  receiptNumber: string;
  storeSnapshot: Record<string, unknown> | null;
  customerSnapshot: Record<string, unknown> | null;
  itemsSnapshot: Record<string, unknown> | null;
  paymentsSnapshot: Record<string, unknown> | null;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  cashierId: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ReceiptCreationAttributes = Optional<
  ReceiptAttributes,
  | 'id'
  | 'uuid'
  | 'storeSnapshot'
  | 'customerSnapshot'
  | 'itemsSnapshot'
  | 'paymentsSnapshot'
  | 'subtotal'
  | 'tax'
  | 'discount'
  | 'total'
  | 'cashierId'
>;

export class Receipt
  extends Model<ReceiptAttributes, ReceiptCreationAttributes>
  implements ReceiptAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number;
  declare orderId: number;
  declare posSessionId: number;
  declare receiptNumber: string;
  declare storeSnapshot: Record<string, unknown> | null;
  declare customerSnapshot: Record<string, unknown> | null;
  declare itemsSnapshot: Record<string, unknown> | null;
  declare paymentsSnapshot: Record<string, unknown> | null;
  declare subtotal: number;
  declare tax: number;
  declare discount: number;
  declare total: number;
  declare cashierId: number | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Receipt.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
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
    orderId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'order_id',
    },
    posSessionId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'pos_session_id',
    },
    receiptNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'receipt_number',
    },
    storeSnapshot: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'store_snapshot',
    },
    customerSnapshot: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'customer_snapshot',
    },
    itemsSnapshot: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'items_snapshot',
    },
    paymentsSnapshot: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'payments_snapshot',
    },
    subtotal: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0.0,
    },
    tax: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0.0,
    },
    discount: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0.0,
    },
    total: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0.0,
    },
    cashierId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'cashier_id',
    },
  },
  {
    sequelize,
    modelName: 'Receipt',
    tableName: 'receipts',
    timestamps: true,
    underscored: true,
  }
);
