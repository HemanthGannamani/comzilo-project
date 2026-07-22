'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('tenants', {
      fields: ['owner_user_id'],
      type: 'foreign key',
      name: 'tenants_owner_user_id_fk',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('tenants', 'tenants_owner_user_id_fk');
  },
};
