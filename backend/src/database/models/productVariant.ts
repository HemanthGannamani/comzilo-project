import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class ProductVariant extends Model {
  declare id: number;
  declare tenantId: number | null;
  declare storeId: number | null;
  declare productId: number;
  declare sku: string;
  declare barcode: string | null;
  declare price: number;
  declare compareAtPrice: number | null;
  declare costPrice: number | null;
  declare stockQuantity: number;
  declare status: 'active' | 'draft' | 'archived';
  declare createdBy: number | null;
  declare updatedBy: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

ProductVariant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tenantId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'tenant_id',
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'store_id',
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id',
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    compareAtPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'compare_at_price',
    },
    costPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'cost_price',
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'stock_quantity',
    },
    status: {
      type: DataTypes.ENUM('active', 'draft', 'archived'),
      defaultValue: 'active',
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'created_by',
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'updated_by',
    },
  },
  {
    sequelize,
    tableName: 'product_variants',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export class VariantAttribute extends Model {
  public id!: number;
  public variantId!: number;
  public attributeName!: string;
  public attributeValue!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

VariantAttribute.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    variantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'variant_id',
    },
    attributeName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'attribute_name',
    },
    attributeValue: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'attribute_value',
    },
  },
  {
    sequelize,
    tableName: 'variant_attributes',
    timestamps: true,
    underscored: true,
  }
);

export class VariantImage extends Model {
  public id!: number;
  public variantId!: number;
  public imageUrl!: string;
  public displayOrder!: number;
  public isPrimary!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

VariantImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    variantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'variant_id',
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'image_url',
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'display_order',
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_primary',
    },
  },
  {
    sequelize,
    tableName: 'variant_images',
    timestamps: true,
    underscored: true,
  }
);

export class VariantInventory extends Model {
  declare id: number;
  declare tenantId: number | null;
  declare storeId: number | null;
  declare variantId: number;
  declare warehouseId: number;
  declare quantityOnHand: number;
  declare reservedStock: number;
  declare quantityAvailable: number;
  declare lowStockThreshold: number;
  declare reorderLevel: number;
  declare status: string;
  declare notes: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

VariantInventory.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    tenantId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'tenant_id',
    },
    storeId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'store_id',
    },
    variantId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'variant_id',
    },
    warehouseId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'warehouse_id',
    },
    quantityOnHand: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'quantity_on_hand',
    },
    reservedStock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'reserved_stock',
    },
    quantityAvailable: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'quantity_available',
    },
    lowStockThreshold: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      field: 'low_stock_threshold',
    },
    reorderLevel: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      field: 'reorder_level',
    },
    status: {
      type: DataTypes.ENUM('in_stock', 'low_stock', 'out_of_stock', 'discontinued'),
      defaultValue: 'in_stock',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'variant_inventories',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export class CategoryAttribute extends Model {
  public id!: number;
  public tenantId!: number | null;
  public categoryId!: number;
  public attributeName!: string;
  public attributeType!: 'text' | 'select' | 'color' | 'size';
  public isRequired!: boolean;
  public isFilterable!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

CategoryAttribute.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tenantId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'tenant_id',
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'category_id',
    },
    attributeName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'attribute_name',
    },
    attributeType: {
      type: DataTypes.ENUM('text', 'select', 'color', 'size'),
      defaultValue: 'select',
      field: 'attribute_type',
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_required',
    },
    isFilterable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_filterable',
    },
  },
  {
    sequelize,
    tableName: 'category_attributes',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
