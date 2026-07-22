/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface ProductAttributes {
  id: number;
  tenantId: number;
  storeId: number;
  productTypeId?: number | null;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string | null;
  description: string | null;
  status: 'draft' | 'active' | 'published' | 'private' | 'archived' | 'deleted';
  visibility: 'public' | 'private' | 'hidden' | 'password_protected';
  brand: string | null;
  brandId: number | null;
  category: string | null;
  price: number;
  comparePrice: number | null;
  cost: number | null;
  weight: number | null;
  dimensions: string | null;
  barcode: string | null;
  taxClass: string | null;
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

export type ProductCreationAttributes = Optional<
  ProductAttributes,
  | 'id'
  | 'productTypeId'
  | 'shortDescription'
  | 'description'
  | 'status'
  | 'visibility'
  | 'brand'
  | 'brandId'
  | 'category'
  | 'price'
  | 'comparePrice'
  | 'cost'
  | 'weight'
  | 'dimensions'
  | 'barcode'
  | 'taxClass'
  | 'seoTitle'
  | 'seoDescription'
  | 'seoKeywords'
  | 'canonicalUrl'
  | 'createdBy'
  | 'updatedBy'
  | 'deletedAt'
>;

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare productTypeId: number | null;
  declare name: string;
  declare slug: string;
  declare sku: string;
  declare shortDescription: string | null;
  declare description: string | null;
  declare status: 'draft' | 'active' | 'published' | 'private' | 'archived' | 'deleted';
  declare visibility: 'public' | 'private' | 'hidden' | 'password_protected';
  declare brand: string | null;
  declare brandId: number | null;
  declare category: string | null;
  declare price: number;
  declare comparePrice: number | null;
  declare cost: number | null;
  declare weight: number | null;
  declare dimensions: string | null;
  declare barcode: string | null;
  declare taxClass: string | null;
  declare seoTitle: string | null;
  declare seoDescription: string | null;
  declare seoKeywords: string | null;
  declare canonicalUrl: string | null;
  declare createdBy: number | null;
  declare updatedBy: number | null;

  declare productType?: any;
  declare categories?: any[];
  declare brandRecord?: any;
  declare collections?: any[];
  declare tags?: any[];
  declare variants?: any[];
  declare media?: any[];
  declare downloads?: any[];
  declare seoRecord?: any;
  declare shippingRecord?: any;
  declare virtualRecord?: any;
  declare podTemplateRecord?: any;
  declare prices?: any[];
  declare optionSets?: any[];
  declare versions?: any[];

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Product.init(
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
    productTypeId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'product_type_id',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'short_description',
    },
    description: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'draft',
    },
    visibility: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'public',
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    brandId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'brand_id',
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    comparePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'compare_price',
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    dimensions: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    barcode: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    taxClass: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'tax_class',
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
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
