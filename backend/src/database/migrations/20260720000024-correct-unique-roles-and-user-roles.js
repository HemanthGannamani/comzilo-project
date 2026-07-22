'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Temporarily disable foreign key checks to allow index reorganization
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // 1. Correct roles table uniqueness
    await queryInterface.addIndex('roles', ['tenant_id'], {
      name: 'roles_tenant_id_fk_idx',
    });

    try {
      await queryInterface.removeIndex('roles', 'roles_tenant_id_code_unique');
    } catch (e) {
      console.log('Index roles_tenant_id_code_unique not found, skipping drop.');
    }

    await queryInterface.addColumn('roles', 'tenant_id_coalesced', {
      type: 'BIGINT UNSIGNED GENERATED ALWAYS AS (COALESCE(tenant_id, 0)) VIRTUAL',
      allowNull: false,
    });

    await queryInterface.addIndex('roles', ['tenant_id_coalesced', 'code'], {
      unique: true,
      name: 'roles_tenant_id_coalesced_code_unique',
    });

    // 2. Correct user_roles table uniqueness
    await queryInterface.addIndex('user_roles', ['role_id'], {
      name: 'user_roles_role_id_fk_idx',
    });
    await queryInterface.addIndex('user_roles', ['store_id'], {
      name: 'user_roles_store_id_fk_idx',
    });

    try {
      await queryInterface.removeIndex('user_roles', 'user_roles_tenant_user_role_store_unique');
    } catch (e) {
      console.log('Index user_roles_tenant_user_role_store_unique not found, skipping drop.');
    }

    await queryInterface.addColumn('user_roles', 'store_id_coalesced', {
      type: 'BIGINT UNSIGNED GENERATED ALWAYS AS (COALESCE(store_id, 0)) VIRTUAL',
      allowNull: false,
    });

    await queryInterface.addIndex(
      'user_roles',
      ['tenant_id', 'user_id', 'role_id', 'store_id_coalesced'],
      {
        unique: true,
        name: 'user_roles_tenant_user_role_store_coalesced_unique',
      }
    );

    // Re-enable foreign key checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Revert user_roles
    await queryInterface.removeIndex(
      'user_roles',
      'user_roles_tenant_user_role_store_coalesced_unique'
    );
    await queryInterface.removeColumn('user_roles', 'store_id_coalesced');
    await queryInterface.addIndex('user_roles', ['tenant_id', 'user_id', 'role_id', 'store_id'], {
      unique: true,
      name: 'user_roles_tenant_user_role_store_unique',
    });
    // Cannot remove these indexes easily because they are required by foreign keys
    // await queryInterface.removeIndex('user_roles', 'user_roles_store_id_fk_idx');
    // await queryInterface.removeIndex('user_roles', 'user_roles_role_id_fk_idx');

    // Revert roles
    await queryInterface.removeIndex('roles', 'roles_tenant_id_coalesced_code_unique');
    await queryInterface.removeColumn('roles', 'tenant_id_coalesced');
    await queryInterface.addIndex('roles', ['tenant_id', 'code'], {
      unique: true,
      name: 'roles_tenant_id_code_unique',
    });
    // Cannot remove this index easily because it is required by foreign key
    // await queryInterface.removeIndex('roles', 'roles_tenant_id_fk_idx');

    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },
};
