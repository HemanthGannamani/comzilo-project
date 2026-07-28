const { User } = require('./dist/database/models/user.js');
const { UserRole } = require('./dist/database/models/userRole.js');
const { Role } = require('./dist/database/models/role.js');

async function checkUserRoles() {
  const user = await User.findOne({ where: { email: 'satishveeravalli2004@gmail.com' } });
  if (!user) {
    console.log('User not found');
    return;
  }
  const userRoles = await UserRole.findAll({ where: { userId: user.id } });
  console.log('User ID:', user.id);
  console.log('UserRoles:', JSON.stringify(userRoles, null, 2));

  const allRoles = await Role.findAll();
  console.log('All Roles in DB:', JSON.stringify(allRoles, null, 2));
}

checkUserRoles();
