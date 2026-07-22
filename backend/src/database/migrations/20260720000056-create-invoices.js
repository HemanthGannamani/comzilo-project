'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('invoices', {
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
      invoice_number: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      invoice_status: {
        type: Sequelize.ENUM('draft', 'issued', 'paid', 'cancelled'),
        allowNull: false,
        defaultValue: 'draft',
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
      issued_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      paid_at: {
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

    await queryInterface.addIndex('invoices', ['tenant_id', 'store_id', 'invoice_number'], {
      unique: true,
      name: 'uq_invoices_tenant_store_invoice_number',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('invoices');
  },
};
