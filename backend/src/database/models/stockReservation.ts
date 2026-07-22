import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface StockReservationAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number;
  referenceType: string | null;
  referenceId: string | null;
  status: 'active' | 'released' | 'fulfilled' | 'expired' | 'cancelled';
  expiresAt: Date | null;
  createdBy: number | null;
  releasedBy: number | null;
  fulfilledBy: number | null;
  releasedAt: Date | null;
  fulfilledAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type StockReservationCreationAttributes = Optional<
  StockReservationAttributes,
  | 'id'
  | 'uuid'
  | 'referenceType'
  | 'referenceId'
  | 'status'
  | 'expiresAt'
  | 'createdBy'
  | 'releasedBy'
  | 'fulfilledBy'
  | 'releasedAt'
  | 'fulfilledAt'
>;

export class StockReservation
  extends Model<StockReservationAttributes, StockReservationCreationAttributes>
  implements StockReservationAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number;
  declare referenceType: string | null;
  declare referenceId: string | null;
  declare status: 'active' | 'released' | 'fulfilled' | 'expired' | 'cancelled';
  declare expiresAt: Date | null;
  declare createdBy: number | null;
  declare releasedBy: number | null;
  declare fulfilledBy: number | null;
  declare releasedAt: Date | null;
  declare fulfilledAt: Date | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

StockReservation.init(
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
    referenceType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'reference_type',
    },
    referenceId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'reference_id',
    },
    status: {
      type: DataTypes.ENUM('active', 'released', 'fulfilled', 'expired', 'cancelled'),
      allowNull: false,
      defaultValue: 'active',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expires_at',
    },
    createdBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'created_by',
    },
    releasedBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'released_by',
    },
    fulfilledBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'fulfilled_by',
    },
    releasedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'released_at',
    },
    fulfilledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'fulfilled_at',
    },
  },
  {
    sequelize,
    modelName: 'StockReservation',
    tableName: 'stock_reservations',
    timestamps: true,
    underscored: true,
  }
);
