'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Query roles dynamically
    const roles = await queryInterface.sequelize.query('SELECT id, code FROM roles', {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    });
    const superAdminRole = roles.find((r) => r.code === 'super_admin');
    const tenantOwnerRole = roles.find((r) => r.code === 'tenant_owner');

    if (!superAdminRole || !tenantOwnerRole) {
      throw new Error('Roles must be seeded before seeding role-permissions');
    }

    // 2. Query permissions dynamically
    const permissions = await queryInterface.sequelize.query('SELECT id, code FROM permissions', {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    });

    const rolePermissions = [];
    const now = new Date();

    // Super Admin gets all permissions in the system
    for (const perm of permissions) {
      rolePermissions.push({
        role_id: superAdminRole.id,
        permission_id: perm.id,
        created_at: now,
      });
    }

    // Tenant Owner gets everything EXCEPT platform level (tenant.view, tenant.manage)
    const platformPerms = ['tenant.view', 'tenant.manage'];
    for (const perm of permissions) {
      if (!platformPerms.includes(perm.code)) {
        rolePermissions.push({
          role_id: tenantOwnerRole.id,
          permission_id: perm.id,
          created_at: now,
        });
      }
    }

    for (const rp of rolePermissions) {
      const existing = await queryInterface.sequelize.query(
        'SELECT id FROM role_permissions WHERE role_id = :role_id AND permission_id = :permission_id',
        {
          replacements: { role_id: rp.role_id, permission_id: rp.permission_id },
          type: queryInterface.sequelize.QueryTypes.SELECT,
        }
      );
      if (existing.length === 0) {
        await queryInterface.bulkInsert('role_permissions', [rp]);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_permissions', null, {});
  },
};
