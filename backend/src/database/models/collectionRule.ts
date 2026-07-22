/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class CollectionRule extends Model<any, any> {
  declare id: number;
  declare collectionId: number;
  declare field: string;
  declare operator: string;
  declare value: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CollectionRule.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    collectionId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'collection_id',
    },
    field: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    operator: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'CollectionRule',
    tableName: 'collection_rules',
    timestamps: true,
    underscored: true,
  }
);
