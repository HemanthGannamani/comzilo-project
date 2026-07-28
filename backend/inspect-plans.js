const { sequelize } = require('./dist/config/database.js');
const { QueryTypes } = require('sequelize');

async function inspectPlans() {
  console.log('--- Plans Table Structure ---');
  const [columns] = await sequelize.query('DESCRIBE plans');
  console.log(columns.map(c => `${c.Field} (${c.Type})`));

  console.log('\n--- Plans Table Rows ---');
  const plans = await sequelize.query('SELECT * FROM plans', { type: QueryTypes.SELECT });
  console.log(JSON.stringify(plans, null, 2));

  process.exit(0);
}

inspectPlans().catch(err => {
  console.error(err);
  process.exit(1);
});
