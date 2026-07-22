import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface WarehouseAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number;
  name: string;
  code: string;
  description: string | null;
  status: 'active' | 'inactive' | 'archived';
  type: 'physical' | 'virtual' | 'fulfillment' | 'returns';
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  isDefault: boolean;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type WarehouseCreationAttributes = Optional<
  WarehouseAttributes,
  | 'id'
  | 'uuid'
  | 'description'
  | 'status'
  | 'type'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'state'
  | 'country'
  | 'postalCode'
  | 'contactName'
  | 'contactPhone'
  | 'contactEmail'
  | 'isDefault'
  | 'createdBy'
  | 'updatedBy'
  | 'deletedAt'
>;

export class Warehouse
  extends Model<WarehouseAttributes, WarehouseCreationAttributes>
  implements WarehouseAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number;
  declare name: string;
  declare code: string;
  declare description: string | null;
  declare status: 'active' | 'inactive' | 'archived';
  declare type: 'physical' | 'virtual' | 'fulfillment' | 'returns';
  declare addressLine1: string | null;
  declare addressLine2: string | null;
  declare city: string | null;
  declare state: string | null;
  declare country: string | null;
  declare postalCode: string | null;
  declare contactName: string | null;
  declare contactPhone: string | null;
  declare contactEmail: string | null;
  declare isDefault: boolean;
  declare createdBy: number | null;
  declare updatedBy: number | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Warehouse.init(
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
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'archived'),
      allowNull: false,
      defaultValue: 'active',
    },
    type: {
      type: DataTypes.ENUM('physical', 'virtual', 'fulfillment', 'returns'),
      allowNull: false,
      defaultValue: 'physical',
    },
    addressLine1: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'address_line1',
    },
    addressLine2: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'address_line2',
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'postal_code',
    },
    contactName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'contact_name',
    },
    contactPhone: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'contact_phone',
    },
    contactEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'contact_email',
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
    modelName: 'Warehouse',
    tableName: 'warehouses',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
