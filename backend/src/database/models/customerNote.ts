import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface CustomerNoteAttributes {
  id: number;
  tenantId: number;
  storeId: number;
  customerId: number;
  authorId: number | null;
  note: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CustomerNoteCreationAttributes = Optional<CustomerNoteAttributes, 'id' | 'authorId'>;

export class CustomerNote
  extends Model<CustomerNoteAttributes, CustomerNoteCreationAttributes>
  implements CustomerNoteAttributes
{
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare customerId: number;
  declare authorId: number | null;
  declare note: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CustomerNote.init(
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
    authorId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'author_id',
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'CustomerNote',
    tableName: 'customer_notes',
    timestamps: true,
    underscored: true,
  }
);
