const { User } = require('./dist/database/models/user.js');
const { UserRole } = require('./dist/database/models/userRole.js');
const { Role } = require('./dist/database/models/role.js');

async function assignSellerRoles() {
  console.log('Assigning full administrative and seller roles to satishveeravalli2004@gmail.com...');

  const user = await User.findOne({ where: { email: 'satishveeravalli2004@gmail.com' } });
  if (!user) {
    console.error('Seller user not found!');
    process.exit(1);
  }

  // Find or create super_admin and store_admin roles
  let superAdminRole = await Role.findOne({ where: { code: 'super_admin' } });
  let storeAdminRole = await Role.findOne({ where: { code: 'store_admin' } });

  if (superAdminRole) {
    await UserRole.findOrCreate({
      where: {
        userId: user.id,
        roleId: superAdminRole.id,
      },
      defaults: {
        tenantId: user.tenantId || 1,
        storeId: null,
      },
    });
    console.log('Assigned super_admin role to user', user.id);
  }

  if (storeAdminRole) {
    await UserRole.findOrCreate({
      where: {
        userId: user.id,
        roleId: storeAdminRole.id,
      },
      defaults: {
        tenantId: user.tenantId || 1,
        storeId: null,
      },
    });
    console.log('Assigned store_admin role to user', user.id);
  }

  // Assign super_admin/store_admin to all users in tenant 1 if needed
  const users = await User.findAll({ where: { tenantId: 1 } });
  for (const u of users) {
    if (superAdminRole) {
      await UserRole.findOrCreate({
        where: { userId: u.id, roleId: superAdminRole.id },
        defaults: { tenantId: 1, storeId: null },
      });
    }
  }

  console.log('Roles assigned successfully!');
  process.exit(0);
}

assignSellerRoles();
