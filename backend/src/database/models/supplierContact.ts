/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class SupplierContact extends Model<any, any> {
  declare id: number;
  declare supplierId: number;
  declare contactName: string;
  declare email: string | null;
  declare phone: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

SupplierContact.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    supplierId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'supplier_id',
    },
    contactName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'contact_name',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'SupplierContact',
    tableName: 'supplier_contacts',
    timestamps: true,
    underscored: true,
  }
);
