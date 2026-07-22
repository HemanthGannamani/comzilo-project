'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('settings_histories').catch(() => {});
    await queryInterface.createTable(
      'settings_histories',
      {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        uuid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          unique: true,
        },
        tenant_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          references: {
            model: 'tenants',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        store_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          references: {
            model: 'stores',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        setting_scope: {
          type: Sequelize.ENUM('global', 'tenant', 'store'),
          allowNull: false,
        },
        setting_key: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        previous_value: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        new_value: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        changed_by: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        },
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      }
    );

    await queryInterface.addIndex('settings_histories', ['tenant_id'], {
      name: 'settings_histories_tenant_id_index',
    });
    await queryInterface.addIndex('settings_histories', ['store_id'], {
      name: 'settings_histories_store_id_index',
    });
    await queryInterface.addIndex('settings_histories', ['setting_scope', 'setting_key'], {
      name: 'settings_histories_scope_key_index',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('settings_histories');
  },
};
