import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface ProductMediaAttributes {
  id: number;
  productId: number;
  mediaId: number;
  isPrimary: boolean;
  sortOrder: number;
  createdAt?: Date;
}

export type ProductMediaCreationAttributes = Optional<
  ProductMediaAttributes,
  'id' | 'isPrimary' | 'sortOrder'
>;

export class ProductMedia
  extends Model<ProductMediaAttributes, ProductMediaCreationAttributes>
  implements ProductMediaAttributes
{
  declare id: number;
  declare productId: number;
  declare mediaId: number;
  declare isPrimary: boolean;
  declare sortOrder: number;

  declare readonly createdAt: Date;
}

ProductMedia.init(
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
    mediaId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'media_id',
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_primary',
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
    modelName: 'ProductMedia',
    tableName: 'product_media',
    timestamps: true,
    updatedAt: false,
    underscored: true,
  }
);
