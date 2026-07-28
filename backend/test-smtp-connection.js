const { sequelize } = require('./dist/config/database.js');
const { QueryTypes } = require('sequelize');

async function checkSmtpConfig() {
  console.log('--- Checking marketing_email_providers in DB ---');
  const providers = await sequelize.query('SELECT * FROM marketing_email_providers', { type: QueryTypes.SELECT });
  console.log(JSON.stringify(providers, null, 2));

  console.log('\n--- Checking environment SMTP variables ---');
  console.log({
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD ? '******' : undefined,
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
    SMTP_FROM_NAME: process.env.SMTP_FROM_NAME,
  });

  process.exit(0);
}

checkSmtpConfig().catch(err => {
  console.error(err);
  process.exit(1);
});
