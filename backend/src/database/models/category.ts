import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface CategoryAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number;
  parentId: number | null;
  name: string;
  slug: string;
  description: string | null;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  visibility: 'public' | 'private' | 'hidden';
  sortOrder: number | null;
  imageMediaId: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type CategoryCreationAttributes = Optional<
  CategoryAttributes,
  | 'id'
  | 'uuid'
  | 'parentId'
  | 'description'
  | 'status'
  | 'visibility'
  | 'sortOrder'
  | 'imageMediaId'
  | 'seoTitle'
  | 'seoDescription'
  | 'seoKeywords'
  | 'canonicalUrl'
  | 'createdBy'
  | 'updatedBy'
  | 'deletedAt'
>;

export class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number;
  declare parentId: number | null;
  declare name: string;
  declare slug: string;
  declare description: string | null;
  declare status: 'draft' | 'active' | 'inactive' | 'archived';
  declare visibility: 'public' | 'private' | 'hidden';
  declare sortOrder: number | null;
  declare imageMediaId: number | null;
  declare seoTitle: string | null;
  declare seoDescription: string | null;
  declare seoKeywords: string | null;
  declare canonicalUrl: string | null;
  declare createdBy: number | null;
  declare updatedBy: number | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Category.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
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
    parentId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'parent_id',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'active', 'inactive', 'archived'),
      allowNull: false,
      defaultValue: 'draft',
    },
    visibility: {
      type: DataTypes.ENUM('public', 'private', 'hidden'),
      allowNull: false,
      defaultValue: 'public',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'sort_order',
    },
    imageMediaId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'image_media_id',
    },
    seoTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'seo_title',
    },
    seoDescription: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'seo_description',
    },
    seoKeywords: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'seo_keywords',
    },
    canonicalUrl: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      field: 'canonical_url',
    },
    createdBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'created_by',
    },
    updatedBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'updated_by',
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
