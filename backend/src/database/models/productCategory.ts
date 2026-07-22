import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface ProductCategoryAttributes {
  id: number;
  tenantId: number;
  storeId: number;
  productId: number;
  categoryId: number;
  isPrimary: boolean;
  sortOrder: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductCategoryCreationAttributes = Optional<
  ProductCategoryAttributes,
  'id' | 'isPrimary' | 'sortOrder'
>;

export class ProductCategory
  extends Model<ProductCategoryAttributes, ProductCategoryCreationAttributes>
  implements ProductCategoryAttributes
{
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare productId: number;
  declare categoryId: number;
  declare isPrimary: boolean;
  declare sortOrder: number | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ProductCategory.init(
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
    categoryId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'category_id',
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_primary',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'sort_order',
    },
  },
  {
    sequelize,
    modelName: 'ProductCategory',
    tableName: 'product_categories',
    timestamps: true,
    underscored: true,
  }
);
