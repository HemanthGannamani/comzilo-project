'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('webhook_logs').catch(() => {});
    await queryInterface.createTable(
      'webhook_logs',
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
        webhook_endpoint_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'webhook_endpoints',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        event_type: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        payload: {
          type: Sequelize.JSON,
          allowNull: false,
        },
        response_status: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        response_body: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        execution_time_ms: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        attempts: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        status: {
          type: Sequelize.ENUM('pending', 'delivered', 'failed'),
          allowNull: false,
          defaultValue: 'pending',
        },
        error: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        next_retry_at: {
          type: Sequelize.DATE,
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

    await queryInterface.addIndex('webhook_logs', ['tenant_id'], {
      name: 'webhook_logs_tenant_id_index',
    });
    await queryInterface.addIndex('webhook_logs', ['webhook_endpoint_id'], {
      name: 'webhook_logs_webhook_endpoint_id_index',
    });
    await queryInterface.addIndex('webhook_logs', ['status'], {
      name: 'webhook_logs_status_index',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('webhook_logs');
  },
};
