import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface ProductCollectionAttributes {
  id: number;
  tenantId: number;
  storeId: number;
  productId: number;
  collectionId: number;
  sortOrder: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductCollectionCreationAttributes = Optional<
  ProductCollectionAttributes,
  'id' | 'sortOrder'
>;

export class ProductCollection
  extends Model<ProductCollectionAttributes, ProductCollectionCreationAttributes>
  implements ProductCollectionAttributes
{
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare productId: number;
  declare collectionId: number;
  declare sortOrder: number | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ProductCollection.init(
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
    collectionId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'collection_id',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'sort_order',
    },
  },
  {
    sequelize,
    modelName: 'ProductCollection',
    tableName: 'product_collections',
    timestamps: true,
    underscored: true,
  }
);
