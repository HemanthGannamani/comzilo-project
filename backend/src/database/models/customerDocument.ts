import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface CustomerDocumentAttributes {
  id: number;
  tenantId: number;
  storeId: number;
  customerId: number;
  mediaId: number;
  documentType:
    'gst_certificate' | 'tax_document' | 'identity_proof' | 'business_license' | 'other';
  createdAt?: Date;
  updatedAt?: Date;
}

export type CustomerDocumentCreationAttributes = Optional<
  CustomerDocumentAttributes,
  'id' | 'documentType'
>;

export class CustomerDocument
  extends Model<CustomerDocumentAttributes, CustomerDocumentCreationAttributes>
  implements CustomerDocumentAttributes
{
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare customerId: number;
  declare mediaId: number;
  declare documentType:
    'gst_certificate' | 'tax_document' | 'identity_proof' | 'business_license' | 'other';

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CustomerDocument.init(
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
    customerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'customer_id',
    },
    mediaId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'media_id',
    },
    documentType: {
      type: DataTypes.ENUM(
        'gst_certificate',
        'tax_document',
        'identity_proof',
        'business_license',
        'other'
      ),
      allowNull: false,
      defaultValue: 'other',
      field: 'document_type',
    },
  },
  {
    sequelize,
    modelName: 'CustomerDocument',
    tableName: 'customer_documents',
    timestamps: true,
    underscored: true,
  }
);
