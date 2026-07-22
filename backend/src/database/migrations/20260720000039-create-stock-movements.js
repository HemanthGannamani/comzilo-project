'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stock_movements', {
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
      warehouse_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'warehouses',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      warehouse_location_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'warehouse_locations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      movement_type: {
        type: Sequelize.ENUM(
          'opening_stock',
          'stock_in',
          'stock_out',
          'adjustment_in',
          'adjustment_out',
          'transfer_in',
          'transfer_out',
          'reservation',
          'reservation_release',
          'reservation_fulfillment',
          'return_in',
          'damage_out',
          'expired_out',
          'correction'
        ),
        allowNull: false,
      },
      direction: {
        type: Sequelize.ENUM('in', 'out', 'neutral'),
        allowNull: false,
      },
      quantity: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      quantity_before: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      quantity_after: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      reference_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      reference_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      reason: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      idempotency_key: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      performed_by: {
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
    });

    await queryInterface.addIndex('stock_movements', ['idempotency_key'], {
      unique: true,
      name: 'uq_stock_movements_idempotency_key',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('stock_movements');
  },
};
