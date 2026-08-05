'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Extend stock_transfer_items with variant_id and variant_sku
    const stiDesc = await queryInterface.describeTable('stock_transfer_items').catch(() => null);
    if (stiDesc) {
      if (!stiDesc.variant_id) {
        await queryInterface.addColumn('stock_transfer_items', 'variant_id', {
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
      if (!stiDesc.variant_sku) {
        await queryInterface.addColumn('stock_transfer_items', 'variant_sku', {
          type: Sequelize.STRING(255),
          allowNull: true,
        });
      }
    }

    // 2. Extend stock_movements with variant_id and variant_sku
    const smDesc = await queryInterface.describeTable('stock_movements').catch(() => null);
    if (smDesc) {
      if (!smDesc.variant_id) {
        await queryInterface.addColumn('stock_movements', 'variant_id', {
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
      if (!smDesc.variant_sku) {
        await queryInterface.addColumn('stock_movements', 'variant_sku', {
          type: Sequelize.STRING(255),
          allowNull: true,
        });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Graceful rollback
  },
};
