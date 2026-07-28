const { sequelize } = require('./dist/config/database.js');
const { QueryTypes } = require('sequelize');

async function auditRbac() {
  console.log('=== AUDITING RBAC DATABASE TABLES ===');

  const roles = await sequelize.query('SELECT * FROM roles', { type: QueryTypes.SELECT });
  console.log(`Roles Count: ${roles.length}`);
  console.log('Roles:', roles.map(r => ({ id: r.id, code: r.code, name: r.name })));

  const permissions = await sequelize.query('SELECT COUNT(*) as cnt FROM permissions', { type: QueryTypes.SELECT });
  console.log(`Permissions Count: ${permissions[0].cnt}`);

  const rolePerms = await sequelize.query('SELECT COUNT(*) as cnt FROM role_permissions', { type: QueryTypes.SELECT });
  console.log(`Role-Permissions Mappings Count: ${rolePerms[0].cnt}`);

  const userRoles = await sequelize.query('SELECT COUNT(*) as cnt FROM user_roles', { type: QueryTypes.SELECT });
  console.log(`User-Roles Mappings Count: ${userRoles[0].cnt}`);

  const samplePerms = await sequelize.query('SELECT code, name, category FROM permissions LIMIT 15', { type: QueryTypes.SELECT });
  console.log('Sample Permissions:', samplePerms);

  process.exit(0);
}

auditRbac().catch(err => {
  console.error(err);
  process.exit(1);
});
