import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface MediaAttributes {
  id: number;
  tenantId: number;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  altText: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MediaCreationAttributes = Optional<MediaAttributes, 'id' | 'altText'>;

export class Media
  extends Model<MediaAttributes, MediaCreationAttributes>
  implements MediaAttributes
{
  public id!: number;
  public tenantId!: number;
  public filename!: string;
  public mimeType!: string;
  public size!: number;
  public url!: string;
  public altText!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Media.init(
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
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'mime_type',
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(2048),
      allowNull: false,
    },
    altText: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'alt_text',
    },
  },
  {
    sequelize,
    modelName: 'Media',
    tableName: 'media',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
