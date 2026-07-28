const { sequelize } = require('./dist/config/database.js');
const { QueryTypes } = require('sequelize');

async function checkRoles() {
  console.log('--- Checking roles table ---');
  const roles = await sequelize.query('SELECT id, code, name FROM roles', { type: QueryTypes.SELECT });
  console.log(JSON.stringify(roles, null, 2));

  process.exit(0);
}

checkRoles().catch(err => {
  console.error(err);
  process.exit(1);
});
