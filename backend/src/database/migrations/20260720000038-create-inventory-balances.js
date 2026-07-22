'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('inventory_balances', {
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
      quantity_on_hand: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      quantity_reserved: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      quantity_available: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      reorder_point: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      reorder_quantity: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      safety_stock: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      last_movement_at: {
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('inventory_balances', ['tenant_id', 'store_id', 'warehouse_id', 'warehouse_location_id', 'product_id'], {
      unique: true,
      name: 'uq_inv_bal_scope',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('inventory_balances');
  },
};
