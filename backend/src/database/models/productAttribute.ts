/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class ProductAttribute extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare name: string;
  declare code: string | null;
  declare type: string;
  declare isRequired: boolean;
  declare isFilterable: boolean;
  declare isSearchable: boolean;
  declare isComparable: boolean;
  declare sortOrder: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ProductAttribute.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'dropdown',
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_required',
    },
    isFilterable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_filterable',
    },
    isSearchable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_searchable',
    },
    isComparable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_comparable',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
  },
  {
    sequelize,
    modelName: 'ProductAttribute',
    tableName: 'product_attributes',
    timestamps: true,
    underscored: true,
  }
);
