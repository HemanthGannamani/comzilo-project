import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class ShippingProvider extends Model {
  public id!: number;
  public code!: string;
  public name!: string;
  public type!: 'aggregator' | 'courier' | 'hyperlocal' | 'postal' | 'custom';
  public description?: string;
  public isActive!: boolean;
  public supportsCod!: boolean;
  public supportsTracking!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ShippingProvider.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('aggregator', 'courier', 'hyperlocal', 'postal', 'custom'),
      allowNull: false,
      defaultValue: 'courier',
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      field: 'is_active',
      allowNull: false,
      defaultValue: true,
    },
    supportsCod: {
      type: DataTypes.BOOLEAN,
      field: 'supports_cod',
      allowNull: false,
      defaultValue: true,
    },
    supportsTracking: {
      type: DataTypes.BOOLEAN,
      field: 'supports_tracking',
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'shipping_providers',
    timestamps: true,
    underscored: true,
  }
);

export default ShippingProvider;
