const { AdminRoleService } = require('./dist/services/adminRole.service.js');

async function debugCreateRole() {
  console.log('--- DEBUGGING CREATE ROLE ---');
  const service = new AdminRoleService();

  try {
    const res = await service.createRole(
      {
        code: `test_debug_${Date.now()}`,
        name: 'Debug Role',
        description: 'Test Description',
        permissionCodes: ['product.read', 'order.read'],
      },
      { authenticatedUserId: 1 }
    );
    console.log('SUCCESS:', res);
  } catch (err) {
    console.error('FAILED TO CREATE ROLE:', err);
  }

  process.exit(0);
}

debugCreateRole();
