require('dotenv').config();
const { Sequelize, QueryTypes } = require('sequelize');

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

async function syncSupportTables() {
  console.log('🚀 Synchronizing Support Center Tables in MySQL...');

  try {
    // 1. Alter support_tickets table to add missing enterprise fields
    const columns = [
      "ADD COLUMN order_id BIGINT UNSIGNED NULL AFTER customer_id",
      "ADD COLUMN invoice_id BIGINT UNSIGNED NULL AFTER order_id",
      "ADD COLUMN shipment_id BIGINT UNSIGNED NULL AFTER invoice_id",
      "ADD COLUMN ai_confidence_score DECIMAL(5,2) NULL AFTER assigned_to",
      "ADD COLUMN ai_resolved TINYINT(1) NOT NULL DEFAULT 0 AFTER ai_confidence_score",
      "ADD COLUMN sla_due_at DATETIME NULL AFTER ai_resolved",
      "ADD COLUMN satisfaction_score INT NULL AFTER sla_due_at",
      "ADD COLUMN csat_feedback TEXT NULL AFTER satisfaction_score"
    ];

    for (const col of columns) {
      await sequelize.query(`ALTER TABLE support_tickets ${col};`).catch(() => {});
    }

    // 2. Create ticket_messages table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS ticket_messages (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        ticket_id BIGINT UNSIGNED NOT NULL,
        sender_type VARCHAR(30) NOT NULL DEFAULT 'customer',
        sender_id BIGINT UNSIGNED NULL,
        sender_name VARCHAR(150) NULL,
        message TEXT NOT NULL,
        is_internal TINYINT(1) NOT NULL DEFAULT 0,
        metadata JSON NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_ticket_msg_ticket_id (ticket_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Create ticket_attachments table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS ticket_attachments (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        ticket_id BIGINT UNSIGNED NOT NULL,
        message_id BIGINT UNSIGNED NULL,
        file_name VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        file_type VARCHAR(100) NOT NULL DEFAULT 'image/png',
        file_size INT NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_att_ticket_id (ticket_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Create ticket_internal_notes table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS ticket_internal_notes (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        ticket_id BIGINT UNSIGNED NOT NULL,
        staff_user_id BIGINT UNSIGNED NOT NULL,
        staff_name VARCHAR(150) NOT NULL,
        note TEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_note_ticket_id (ticket_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. Create support_canned_responses table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS support_canned_responses (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        tenant_id BIGINT UNSIGNED NOT NULL,
        store_id BIGINT UNSIGNED NOT NULL,
        title VARCHAR(150) NOT NULL,
        shortcut VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'General',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_canned_tenant_store (tenant_id, store_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 6. Create support_knowledge_base table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS support_knowledge_base (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        tenant_id BIGINT UNSIGNED NOT NULL,
        store_id BIGINT UNSIGNED NOT NULL,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'General',
        content TEXT NOT NULL,
        tags VARCHAR(255) NULL,
        is_published TINYINT(1) NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_kb_tenant_store (tenant_id, store_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 7. Create support_audit_logs table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS support_audit_logs (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        tenant_id BIGINT UNSIGNED NOT NULL,
        store_id BIGINT UNSIGNED NOT NULL,
        ticket_id BIGINT UNSIGNED NOT NULL,
        actor_type VARCHAR(30) NOT NULL,
        actor_id BIGINT UNSIGNED NULL,
        action VARCHAR(100) NOT NULL,
        details TEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_audit_ticket (ticket_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed default Canned Responses & Knowledge Base
    const stores = await sequelize.query(`SELECT id, tenant_id FROM stores LIMIT 5`, { type: QueryTypes.SELECT }).catch(() => []);
    for (const store of stores) {
      const existing = await sequelize.query(`SELECT COUNT(*) as cnt FROM support_canned_responses WHERE store_id = ${store.id}`, { type: QueryTypes.SELECT });
      if (Number(existing[0]?.cnt || 0) === 0) {
        await sequelize.query(`
          INSERT INTO support_canned_responses (tenant_id, store_id, title, shortcut, content, category)
          VALUES 
          (${store.tenant_id}, ${store.id}, 'Refund Approved', '/refund', 'Your refund has been approved and processed. Reversal will reflect in 2-3 business days.', 'Refund'),
          (${store.tenant_id}, ${store.id}, 'Replacement Sent', '/replacement', 'We have dispatched a fresh replacement unit via Express courier with priority tracking.', 'Shipping'),
          (${store.tenant_id}, ${store.id}, 'Order Shipped', '/shipped', 'Your order is handed over to our logistics partner. Live tracking info has been updated.', 'Shipping'),
          (${store.tenant_id}, ${store.id}, 'Payment Received', '/paid', 'Payment confirmed! Your order is currently being packed at our central warehouse.', 'Payment');
        `);
      }

      const existingKb = await sequelize.query(`SELECT COUNT(*) as cnt FROM support_knowledge_base WHERE store_id = ${store.id}`, { type: QueryTypes.SELECT });
      if (Number(existingKb[0]?.cnt || 0) === 0) {
        await sequelize.query(`
          INSERT INTO support_knowledge_base (tenant_id, store_id, title, category, content, tags, is_published)
          VALUES
          (${store.tenant_id}, ${store.id}, 'How to Track Order Shipment', 'Shipping', 'Log in to your customer portal, click My Orders, and select Track Shipment for real-time GPS tracking.', 'shipping,tracking,carrier', 1),
          (${store.tenant_id}, ${store.id}, 'Return & Refund Policy', 'Refund', 'Items can be returned within 7 days of delivery in original packaging. Refunds are issued to original payment method.', 'returns,refund,policy', 1),
          (${store.tenant_id}, ${store.id}, 'Payment Methods Supported', 'Payment', 'We support Credit Cards, Debit Cards, UPI, Net Banking, and Cash on Delivery (COD).', 'payment,upi,cod', 1);
        `);
      }
    }

    console.log('✅ Support Center Tables & Seed Data Migration Complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration Error:', err);
    process.exit(1);
  }
}

syncSupportTables();
