'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const oiDesc = await queryInterface.describeTable('order_items').catch(() => null);
    if (oiDesc) {
      if (!oiDesc.variant_id) {
        await queryInterface.addColumn('order_items', 'variant_id', {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          references: {
            model: 'product_variants',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        });
      }
      if (!oiDesc.variant_sku) {
        await queryInterface.addColumn('order_items', 'variant_sku', {
          type: Sequelize.STRING(255),
          allowNull: true,
        });
      }
      if (!oiDesc.variant_attributes) {
        await queryInterface.addColumn('order_items', 'variant_attributes', {
          type: Sequelize.JSON,
          allowNull: true,
        });
      }
      if (!oiDesc.warehouse_id) {
        await queryInterface.addColumn('order_items', 'warehouse_id', {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          references: {
            model: 'warehouses',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Graceful rollback
  },
};
