'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Create order_shipments table
    await queryInterface.createTable('order_shipments', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tenant_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      store_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      carrier: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      tracking_number: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      tracking_url: {
        type: Sequelize.STRING(1024),
        allowNull: true,
      },
      shipping_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: 'pending',
      },
      shipped_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      delivered_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // 2. Create order_returns table
    await queryInterface.createTable('order_returns', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tenant_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      store_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      return_number: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      reason: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: 'requested',
      },
      restock_inventory: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // 3. Create order_status_history table
    await queryInterface.createTable('order_status_history', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      previous_status: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      new_status: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('order_status_history');
    await queryInterface.dropTable('order_returns');
    await queryInterface.dropTable('order_shipments');
  },
};
