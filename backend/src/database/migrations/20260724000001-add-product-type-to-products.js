'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('products');
    if (!tableInfo.product_type) {
      await queryInterface.addColumn('products', 'product_type', {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'physical',
        after: 'store_id',
      });
    }
  },

  async down(queryInterface) {
    const tableInfo = await queryInterface.describeTable('products');
    if (tableInfo.product_type) {
      await queryInterface.removeColumn('products', 'product_type');
    }
  },
};
