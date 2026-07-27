'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add user_id column to customers table if it doesn't exist
    const tableInfo = await queryInterface.describeTable('customers');
    if (!tableInfo.user_id) {
      await queryInterface.addColumn('customers', 'user_id', {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        after: 'store_id',
      });
    }
  },

  down: async (queryInterface, _Sequelize) => {
    const tableInfo = await queryInterface.describeTable('customers');
    if (tableInfo.user_id) {
      await queryInterface.removeColumn('customers', 'user_id');
    }
  },
};
