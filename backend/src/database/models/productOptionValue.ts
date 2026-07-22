/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class ProductOptionValue extends Model<any, any> {
  declare id: number;
  declare optionSetId: number;
  declare value: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

ProductOptionValue.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    optionSetId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'option_set_id',
    },
    value: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ProductOptionValue',
    tableName: 'product_option_values',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
