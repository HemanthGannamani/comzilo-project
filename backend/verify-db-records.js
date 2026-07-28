const { sequelize } = require('./dist/config/database.js');
const { QueryTypes } = require('sequelize');

async function verifyDbRecords() {
  console.log('--- Checking marketing_email_logs table ---');
  const logs = await sequelize.query(
    'SELECT id, tenant_id, recipient, subject, template_name, provider_type, status, message_id, sent_at FROM marketing_email_logs ORDER BY id DESC LIMIT 5',
    { type: QueryTypes.SELECT }
  );
  console.log(JSON.stringify(logs, null, 2));

  process.exit(0);
}

verifyDbRecords().catch(err => {
  console.error(err);
  process.exit(1);
});
