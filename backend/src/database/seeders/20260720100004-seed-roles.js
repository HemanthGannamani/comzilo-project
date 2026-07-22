'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = [
      {
        id: 1,
        tenant_id: null,
        code: 'super_admin',
        name: 'Super Administrator',
        description: 'System-wide platform root administrator',
        is_system: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        tenant_id: null,
        code: 'tenant_owner',
        name: 'Tenant Owner',
        description: 'Store company owner with ultimate tenant privileges',
        is_system: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        tenant_id: null,
        code: 'store_admin',
        name: 'Store Administrator',
        description: 'Store manager with high level operational configurations',
        is_system: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        tenant_id: null,
        code: 'manager',
        name: 'Manager',
        description: 'Store staff manager overseeing orders and catalog',
        is_system: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        tenant_id: null,
        code: 'staff',
        name: 'Staff Member',
        description: 'Regular operations staff handler',
        is_system: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        tenant_id: null,
        code: 'customer',
        name: 'Customer',
        description: 'Store consumer user profile',
        is_system: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    for (const role of roles) {
      const existing = await queryInterface.sequelize.query(
        'SELECT id FROM roles WHERE code = :code AND tenant_id IS NULL',
        {
          replacements: { code: role.code },
          type: queryInterface.sequelize.QueryTypes.SELECT,
        }
      );
      if (existing.length === 0) {
        await queryInterface.bulkInsert('roles', [role]);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
