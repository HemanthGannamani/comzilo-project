import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface CustomerAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number;
  customerCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  alternatePhone: string | null;
  gender: string | null;
  dateOfBirth: Date | null;
  profileImageId: number | null;
  status: 'active' | 'inactive' | 'blocked';
  customerType: 'individual' | 'business';
  taxNumber: string | null;
  companyName: string | null;
  notes: string | null;
  preferredLanguage: string;
  preferredCurrency: string;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type CustomerCreationAttributes = Optional<
  CustomerAttributes,
  | 'id'
  | 'uuid'
  | 'alternatePhone'
  | 'gender'
  | 'dateOfBirth'
  | 'profileImageId'
  | 'status'
  | 'customerType'
  | 'taxNumber'
  | 'companyName'
  | 'notes'
  | 'preferredLanguage'
  | 'preferredCurrency'
  | 'createdBy'
  | 'updatedBy'
  | 'deletedAt'
>;

export class Customer
  extends Model<CustomerAttributes, CustomerCreationAttributes>
  implements CustomerAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number;
  declare customerCode: string;
  declare firstName: string;
  declare lastName: string;
  declare fullName: string;
  declare email: string;
  declare phone: string;
  declare alternatePhone: string | null;
  declare gender: string | null;
  declare dateOfBirth: Date | null;
  declare profileImageId: number | null;
  declare status: 'active' | 'inactive' | 'blocked';
  declare customerType: 'individual' | 'business';
  declare taxNumber: string | null;
  declare companyName: string | null;
  declare notes: string | null;
  declare preferredLanguage: string;
  declare preferredCurrency: string;
  declare createdBy: number | null;
  declare updatedBy: number | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Customer.init(
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
    customerCode: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'customer_code',
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'last_name',
    },
    fullName: {
      type: DataTypes.STRING(510),
      allowNull: false,
      field: 'full_name',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    alternatePhone: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'alternate_phone',
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'date_of_birth',
    },
    profileImageId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'profile_image_id',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'blocked'),
      allowNull: false,
      defaultValue: 'active',
    },
    customerType: {
      type: DataTypes.ENUM('individual', 'business'),
      allowNull: false,
      defaultValue: 'individual',
      field: 'customer_type',
    },
    taxNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'tax_number',
    },
    companyName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'company_name',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    preferredLanguage: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'en',
      field: 'preferred_language',
    },
    preferredCurrency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'USD',
      field: 'preferred_currency',
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
    modelName: 'Customer',
    tableName: 'customers',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
