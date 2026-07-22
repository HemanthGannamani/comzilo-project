import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface POSSessionAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number;
  registerId: number;
  cashierId: number;
  openingCash: number;
  closingCash: number | null;
  expectedCash: number | null;
  variance: number | null;
  totalSales: number;
  totalRefunds: number;
  status: 'open' | 'closed';
  openedAt: Date;
  closedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type POSSessionCreationAttributes = Optional<
  POSSessionAttributes,
  | 'id'
  | 'uuid'
  | 'openingCash'
  | 'closingCash'
  | 'expectedCash'
  | 'variance'
  | 'totalSales'
  | 'totalRefunds'
  | 'status'
  | 'openedAt'
  | 'closedAt'
>;

export class POSSession
  extends Model<POSSessionAttributes, POSSessionCreationAttributes>
  implements POSSessionAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number;
  declare registerId: number;
  declare cashierId: number;
  declare openingCash: number;
  declare closingCash: number | null;
  declare expectedCash: number | null;
  declare variance: number | null;
  declare totalSales: number;
  declare totalRefunds: number;
  declare status: 'open' | 'closed';
  declare openedAt: Date;
  declare closedAt: Date | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

POSSession.init(
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
    registerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'register_id',
    },
    cashierId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'cashier_id',
    },
    openingCash: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0.0,
      field: 'opening_cash',
    },
    closingCash: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: true,
      field: 'closing_cash',
    },
    expectedCash: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: true,
      field: 'expected_cash',
    },
    variance: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: true,
    },
    totalSales: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0.0,
      field: 'total_sales',
    },
    totalRefunds: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0.0,
      field: 'total_refunds',
    },
    status: {
      type: DataTypes.ENUM('open', 'closed'),
      allowNull: false,
      defaultValue: 'open',
    },
    openedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'opened_at',
    },
    closedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'closed_at',
    },
  },
  {
    sequelize,
    modelName: 'POSSession',
    tableName: 'pos_sessions',
    timestamps: true,
    underscored: true,
  }
);
