import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface POSRegisterAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number;
  name: string;
  code: string;
  status: 'open' | 'closed';
  openingAmount: number;
  openingTime: Date | null;
  closingAmount: number | null;
  closingTime: Date | null;
  openedBy: number | null;
  closedBy: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type POSRegisterCreationAttributes = Optional<
  POSRegisterAttributes,
  | 'id'
  | 'uuid'
  | 'status'
  | 'openingAmount'
  | 'openingTime'
  | 'closingAmount'
  | 'closingTime'
  | 'openedBy'
  | 'closedBy'
>;

export class POSRegister
  extends Model<POSRegisterAttributes, POSRegisterCreationAttributes>
  implements POSRegisterAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number;
  declare name: string;
  declare code: string;
  declare status: 'open' | 'closed';
  declare openingAmount: number;
  declare openingTime: Date | null;
  declare closingAmount: number | null;
  declare closingTime: Date | null;
  declare openedBy: number | null;
  declare closedBy: number | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

POSRegister.init(
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('open', 'closed'),
      allowNull: false,
      defaultValue: 'closed',
    },
    openingAmount: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0.0,
      field: 'opening_amount',
    },
    openingTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'opening_time',
    },
    closingAmount: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: true,
      field: 'closing_amount',
    },
    closingTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'closing_time',
    },
    openedBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'opened_by',
    },
    closedBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'closed_by',
    },
  },
  {
    sequelize,
    modelName: 'POSRegister',
    tableName: 'pos_registers',
    timestamps: true,
    underscored: true,
  }
);
