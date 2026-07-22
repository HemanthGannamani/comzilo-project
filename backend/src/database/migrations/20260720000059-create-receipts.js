'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('receipts', {
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
        allowNull: false,
        references: {
          model: 'stores',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      order_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      pos_session_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'pos_sessions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      receipt_number: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      store_snapshot: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      customer_snapshot: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      items_snapshot: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      payments_snapshot: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      subtotal: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: false,
        defaultValue: 0.0,
      },
      tax: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: false,
        defaultValue: 0.0,
      },
      discount: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: false,
        defaultValue: 0.0,
      },
      total: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: false,
        defaultValue: 0.0,
      },
      cashier_id: {
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('receipts', ['tenant_id', 'store_id', 'receipt_number'], {
      unique: true,
      name: 'uq_receipts_tenant_store_receipt_number',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('receipts');
  },
};
