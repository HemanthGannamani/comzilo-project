'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('tenant_settings').catch(() => {});
    await queryInterface.createTable(
      'tenant_settings',
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
          allowNull: false,
          references: {
            model: 'tenants',
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
        category: {
          type: Sequelize.STRING(50),
          allowNull: false,
          defaultValue: 'general',
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
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      }
    );

    await queryInterface.addIndex('tenant_settings', ['tenant_id', 'setting_key'], {
      name: 'tenant_settings_tenant_id_setting_key_unique',
      unique: true,
    });
    await queryInterface.addIndex('tenant_settings', ['tenant_id'], {
      name: 'tenant_settings_tenant_id_index',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tenant_settings');
  },
};
