'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('integration_sync_logs').catch(() => {});
    await queryInterface.createTable(
      'integration_sync_logs',
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
        integration_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'integrations',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        sync_type: {
          type: Sequelize.ENUM('orders', 'inventory', 'customers', 'products'),
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM('success', 'failed', 'partial'),
          allowNull: false,
        },
        records_synced: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        error_details: {
          type: Sequelize.JSON,
          allowNull: true,
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

    await queryInterface.addIndex('integration_sync_logs', ['tenant_id'], {
      name: 'integration_sync_logs_tenant_id_index',
    });
    await queryInterface.addIndex('integration_sync_logs', ['integration_id'], {
      name: 'integration_sync_logs_integration_id_index',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('integration_sync_logs');
  },
};
