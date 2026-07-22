import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface InvoiceAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number;
  orderId: number;
  invoiceNumber: string;
  invoiceStatus: 'draft' | 'issued' | 'paid' | 'cancelled';
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  issuedAt: Date | null;
  dueDate: Date | null;
  paidAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type InvoiceCreationAttributes = Optional<
  InvoiceAttributes,
  'id' | 'uuid' | 'invoiceStatus' | 'tax' | 'discount' | 'issuedAt' | 'dueDate' | 'paidAt'
>;

export class Invoice
  extends Model<InvoiceAttributes, InvoiceCreationAttributes>
  implements InvoiceAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number;
  declare orderId: number;
  declare invoiceNumber: string;
  declare invoiceStatus: 'draft' | 'issued' | 'paid' | 'cancelled';
  declare subtotal: number;
  declare tax: number;
  declare discount: number;
  declare total: number;
  declare issuedAt: Date | null;
  declare dueDate: Date | null;
  declare paidAt: Date | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Invoice.init(
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
    invoiceNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'invoice_number',
    },
    invoiceStatus: {
      type: DataTypes.ENUM('draft', 'issued', 'paid', 'cancelled'),
      allowNull: false,
      defaultValue: 'draft',
      field: 'invoice_status',
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
    issuedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'issued_at',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'due_date',
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'paid_at',
    },
  },
  {
    sequelize,
    modelName: 'Invoice',
    tableName: 'invoices',
    timestamps: true,
    underscored: true,
  }
);
