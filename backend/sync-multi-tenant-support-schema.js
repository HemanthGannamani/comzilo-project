require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'comzilo_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

async function runMigration() {
  console.log('🚀 Synchronizing Multi-Tenant Columns for support_tickets...');
  try {
    const columns = [
      "ADD COLUMN seller_id BIGINT UNSIGNED NULL AFTER store_id",
      "ADD COLUMN created_by BIGINT UNSIGNED NULL AFTER assigned_to"
    ];

    for (const col of columns) {
      await sequelize.query(`ALTER TABLE support_tickets ${col};`).catch(() => {});
    }

    // Populate seller_id from store owner if missing
    await sequelize.query(`
      UPDATE support_tickets st
      JOIN stores s ON st.store_id = s.id
      SET st.seller_id = s.user_id
      WHERE st.seller_id IS NULL;
    `).catch(() => {});

    console.log('✅ Multi-Tenant support_tickets columns & seller_id sync complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration Error:', err);
    process.exit(1);
  }
}

runMigration();
