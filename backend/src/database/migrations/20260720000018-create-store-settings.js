'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Ensure clean state: drop existing table if it exists
    await queryInterface.dropTable('store_settings').catch(() => {});
    await queryInterface.createTable(
      'store_settings',
      {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        tenant_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'tenants',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        store_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'stores',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        setting_key: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        setting_value: {
          type: Sequelize.JSON,
          allowNull: false,
        },
        is_public: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
        engine: 'InnoDB',
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      }
    );

    // Ensure unique index on store_id + setting_key (drop if exists to avoid duplicate errors)
    await queryInterface
      .removeIndex('store_settings', 'store_settings_store_id_setting_key_unique')
      .catch(() => {});
    await queryInterface.addIndex('store_settings', ['store_id', 'setting_key'], {
      unique: true,
      name: 'store_settings_store_id_setting_key_unique',
    });

    // Index for tenant isolation lookup
    await queryInterface.addIndex('store_settings', ['tenant_id'], {
      name: 'store_settings_tenant_id_index',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('store_settings');
  },
};
