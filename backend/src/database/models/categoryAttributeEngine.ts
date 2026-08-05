import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class AttributeGroup extends Model {
  declare id: number;
  declare tenantId: number | null;
  declare name: string;
  declare code: string;
  declare displayOrder: number;
  declare status: 'active' | 'inactive' | 'archived';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

AttributeGroup.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'display_order',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'archived'),
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    tableName: 'attribute_groups',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export class CategoryAttribute extends Model {
  declare id: number;
  declare tenantId: number | null;
  declare categoryId: number;
  declare attributeGroupId: number | null;
  declare attributeName: string;
  declare displayName: string | null;
  declare code: string | null;
  declare description: string | null;
  declare attributeType: string;
  declare placeholder: string | null;
  declare defaultValue: string | null;
  declare isRequired: boolean;
  declare isUnique: boolean;
  declare isSearchable: boolean;
  declare isFilterable: boolean;
  declare isSortable: boolean;
  declare isVisible: boolean;
  declare displayOrder: number;
  declare status: 'active' | 'inactive' | 'archived';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

CategoryAttribute.init(
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
    categoryId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'category_id',
    },
    attributeGroupId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'attribute_group_id',
    },
    attributeName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'attribute_name',
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'display_name',
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    attributeType: {
      type: DataTypes.STRING,
      defaultValue: 'select',
      field: 'attribute_type',
    },
    placeholder: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    defaultValue: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'default_value',
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_required',
    },
    isUnique: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_unique',
    },
    isSearchable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_searchable',
    },
    isFilterable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_filterable',
    },
    isSortable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_sortable',
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_visible',
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'display_order',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'archived'),
      defaultValue: 'active',
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

export class AttributeValue extends Model {
  declare id: number;
  declare tenantId: number | null;
  declare attributeGroupId: number;
  declare value: string;
  declare hexCode: string | null;
  declare displayOrder: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

AttributeValue.init(
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
    attributeGroupId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'attribute_group_id',
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hexCode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'hex_code',
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'display_order',
    },
  },
  {
    sequelize,
    tableName: 'attribute_values',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
