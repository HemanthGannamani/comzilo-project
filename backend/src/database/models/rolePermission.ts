/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class RolePermission extends Model<any, any> {
  declare id: number;
  declare roleId: number;
  declare permissionId: number;
  declare readonly createdAt: Date;
}

RolePermission.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'role_id',
    },
    permissionId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'permission_id',
    },
  },
  {
    sequelize,
    tableName: 'role_permissions',
    underscored: true,
    timestamps: true,
    updatedAt: false,
  }
);
