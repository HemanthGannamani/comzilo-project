import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface ProductTagAttributes {
  id: number;
  tenantId: number;
  storeId: number;
  productId: number;
  tagId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductTagCreationAttributes = Optional<ProductTagAttributes, 'id'>;

export class ProductTag
  extends Model<ProductTagAttributes, ProductTagCreationAttributes>
  implements ProductTagAttributes
{
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare productId: number;
  declare tagId: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ProductTag.init(
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
    productId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'product_id',
    },
    tagId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'tag_id',
    },
  },
  {
    sequelize,
    modelName: 'ProductTag',
    tableName: 'product_tags',
    timestamps: true,
    underscored: true,
  }
);
