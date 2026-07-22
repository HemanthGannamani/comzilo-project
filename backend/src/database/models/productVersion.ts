/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class ProductVersion extends Model<any, any> {
  declare id: number;
  declare productId: number;
  declare versionNumber: number;
  declare changedBy: number | null;
  declare changeSummary: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ProductVersion.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    productId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'product_id',
    },
    versionNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'version_number',
    },
    changedBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'changed_by',
    },
    changeSummary: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'change_summary',
    },
  },
  {
    sequelize,
    modelName: 'ProductVersion',
    tableName: 'product_versions',
    timestamps: true,
    underscored: true,
  }
);
