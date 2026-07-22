import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface CustomerAddressAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number;
  customerId: number;
  addressType: 'billing' | 'shipping' | 'home' | 'office' | 'other';
  fullName: string;
  phone: string;
  company: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  landmark: string | null;
  latitude: number | null;
  longitude: number | null;
  isDefaultBilling: boolean;
  isDefaultShipping: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type CustomerAddressCreationAttributes = Optional<
  CustomerAddressAttributes,
  | 'id'
  | 'uuid'
  | 'addressType'
  | 'company'
  | 'addressLine2'
  | 'landmark'
  | 'latitude'
  | 'longitude'
  | 'isDefaultBilling'
  | 'isDefaultShipping'
  | 'deletedAt'
>;

export class CustomerAddress
  extends Model<CustomerAddressAttributes, CustomerAddressCreationAttributes>
  implements CustomerAddressAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number;
  declare customerId: number;
  declare addressType: 'billing' | 'shipping' | 'home' | 'office' | 'other';
  declare fullName: string;
  declare phone: string;
  declare company: string | null;
  declare addressLine1: string;
  declare addressLine2: string | null;
  declare city: string;
  declare state: string;
  declare country: string;
  declare postalCode: string;
  declare landmark: string | null;
  declare latitude: number | null;
  declare longitude: number | null;
  declare isDefaultBilling: boolean;
  declare isDefaultShipping: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

CustomerAddress.init(
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
    customerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'customer_id',
    },
    addressType: {
      type: DataTypes.ENUM('billing', 'shipping', 'home', 'office', 'other'),
      allowNull: false,
      defaultValue: 'shipping',
      field: 'address_type',
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'full_name',
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    addressLine1: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'address_line1',
    },
    addressLine2: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'address_line2',
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'postal_code',
    },
    landmark: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    isDefaultBilling: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_default_billing',
    },
    isDefaultShipping: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_default_shipping',
    },
  },
  {
    sequelize,
    modelName: 'CustomerAddress',
    tableName: 'customer_addresses',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
