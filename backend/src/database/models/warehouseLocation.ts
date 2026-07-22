import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface WarehouseLocationAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number;
  warehouseId: number;
  name: string;
  code: string;
  description: string | null;
  zone: string | null;
  aisle: string | null;
  rack: string | null;
  shelf: string | null;
  bin: string | null;
  status: 'active' | 'inactive' | 'archived';
  isDefault: boolean;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type WarehouseLocationCreationAttributes = Optional<
  WarehouseLocationAttributes,
  | 'id'
  | 'uuid'
  | 'description'
  | 'zone'
  | 'aisle'
  | 'rack'
  | 'shelf'
  | 'bin'
  | 'status'
  | 'isDefault'
  | 'createdBy'
  | 'updatedBy'
  | 'deletedAt'
>;

export class WarehouseLocation
  extends Model<WarehouseLocationAttributes, WarehouseLocationCreationAttributes>
  implements WarehouseLocationAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number;
  declare warehouseId: number;
  declare name: string;
  declare code: string;
  declare description: string | null;
  declare zone: string | null;
  declare aisle: string | null;
  declare rack: string | null;
  declare shelf: string | null;
  declare bin: string | null;
  declare status: 'active' | 'inactive' | 'archived';
  declare isDefault: boolean;
  declare createdBy: number | null;
  declare updatedBy: number | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

WarehouseLocation.init(
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
    warehouseId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'warehouse_id',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    zone: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    aisle: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    rack: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    shelf: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    bin: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'archived'),
      allowNull: false,
      defaultValue: 'active',
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_default',
    },
    createdBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'created_by',
    },
    updatedBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'updated_by',
    },
  },
  {
    sequelize,
    modelName: 'WarehouseLocation',
    tableName: 'warehouse_locations',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
