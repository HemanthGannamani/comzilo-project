import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface StockTransferAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number;
  sourceWarehouseId: number;
  destinationWarehouseId: number;
  status:
    | 'draft'
    | 'pending_approval'
    | 'approved'
    | 'in_transit'
    | 'partially_received'
    | 'received'
    | 'rejected'
    | 'cancelled';
  referenceNumber: string | null;
  notes: string | null;
  requestedBy: number | null;
  approvedBy: number | null;
  shippedBy: number | null;
  receivedBy: number | null;
  approvedAt: Date | null;
  shippedAt: Date | null;
  receivedAt: Date | null;
  cancelledAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type StockTransferCreationAttributes = Optional<
  StockTransferAttributes,
  | 'id'
  | 'uuid'
  | 'status'
  | 'referenceNumber'
  | 'notes'
  | 'requestedBy'
  | 'approvedBy'
  | 'shippedBy'
  | 'receivedBy'
  | 'approvedAt'
  | 'shippedAt'
  | 'receivedAt'
  | 'cancelledAt'
>;

export class StockTransfer
  extends Model<StockTransferAttributes, StockTransferCreationAttributes>
  implements StockTransferAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number;
  declare sourceWarehouseId: number;
  declare destinationWarehouseId: number;
  declare status:
    | 'draft'
    | 'pending_approval'
    | 'approved'
    | 'in_transit'
    | 'partially_received'
    | 'received'
    | 'rejected'
    | 'cancelled';
  declare referenceNumber: string | null;
  declare notes: string | null;
  declare requestedBy: number | null;
  declare approvedBy: number | null;
  declare shippedBy: number | null;
  declare receivedBy: number | null;
  declare approvedAt: Date | null;
  declare shippedAt: Date | null;
  declare receivedAt: Date | null;
  declare cancelledAt: Date | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

StockTransfer.init(
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
    sourceWarehouseId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'source_warehouse_id',
    },
    destinationWarehouseId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'destination_warehouse_id',
    },
    status: {
      type: DataTypes.ENUM(
        'draft',
        'pending_approval',
        'approved',
        'in_transit',
        'partially_received',
        'received',
        'rejected',
        'cancelled'
      ),
      allowNull: false,
      defaultValue: 'draft',
    },
    referenceNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'reference_number',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requestedBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'requested_by',
    },
    approvedBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'approved_by',
    },
    shippedBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'shipped_by',
    },
    receivedBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'received_by',
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'approved_at',
    },
    shippedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'shipped_at',
    },
    receivedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'received_at',
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'cancelled_at',
    },
  },
  {
    sequelize,
    modelName: 'StockTransfer',
    tableName: 'stock_transfers',
    timestamps: true,
    underscored: true,
  }
);
