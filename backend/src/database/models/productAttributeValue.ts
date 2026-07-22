/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class ProductAttributeValue extends Model<any, any> {
  declare id: number;
  declare attributeId: number;
  declare value: string;
  declare label: string | null;
  declare swatchData: string | null;
  declare sortOrder: number;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ProductAttributeValue.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    attributeId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'attribute_id',
    },
    value: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    swatchData: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      field: 'swatch_data',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'ProductAttributeValue',
    tableName: 'product_attribute_values',
    timestamps: true,
    underscored: true,
  }
);
