/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class ProductType extends Model<any, any> {
  declare id: number;
  declare code: string;
  declare name: string;
  declare description: string | null;
  declare supportsInventory: boolean;
  declare supportsShipping: boolean;
  declare supportsVariants: boolean;
  declare supportsDownloads: boolean;
  declare supportsVirtual: boolean;
  declare supportsPrintOnDemand: boolean;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ProductType.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    supportsInventory: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'supports_inventory',
    },
    supportsShipping: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'supports_shipping',
    },
    supportsVariants: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'supports_variants',
    },
    supportsDownloads: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'supports_downloads',
    },
    supportsVirtual: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'supports_virtual',
    },
    supportsPrintOnDemand: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'supports_print_on_demand',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'ProductType',
    tableName: 'product_types',
    timestamps: true,
    underscored: true,
  }
);
