const nodemailer = require('nodemailer');
const { sequelize } = require('./dist/config/database.js');
const { QueryTypes } = require('sequelize');
const { SmtpService } = require('./dist/services/smtpService.js');

async function debugDirectEmail() {
  console.log('=== DEBUGGING GMAIL SMTP DISPATCH ===');

  const [dbRow] = await sequelize.query(
    'SELECT * FROM marketing_email_providers WHERE provider_type = "smtp" OR provider_type = "gmail" ORDER BY id DESC LIMIT 1',
    { type: QueryTypes.SELECT }
  );

  const dbParsed = typeof dbRow.config_json === 'string' ? JSON.parse(dbRow.config_json) : dbRow.config_json;
  const decryptedPass = SmtpService.decryptPassword(dbParsed.password || dbParsed.smtpPassword || dbParsed.smtpPass);

  console.log('Provider User:', dbParsed.smtpUsername || dbParsed.username);
  console.log('Decrypted Password Length:', decryptedPass ? decryptedPass.length : 0);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: dbParsed.smtpUsername || dbParsed.username,
      pass: decryptedPass,
    },
    debug: true,
    logger: true,
  });

  try {
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP Connection Verified!');

    const mailOptions = {
      from: `"Comzilo Admin" <${dbParsed.smtpUsername || dbParsed.username}>`,
      to: 'hemanthgannamani@gmail.com',
      subject: 'URGENT: Comzilo Seller Login Credentials',
      text: 'Hello Hemanth,\n\nYour Comzilo seller credentials are:\nEmail: hemanthgannamani@gmail.com\nTemporary Password: Comzilo_SecurePass2026!\nLogin URL: http://localhost:5173/login\n\nPlease change your password upon first login.',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 30px; background: #0F172A; color: #FFFFFF; border-radius: 10px;">
          <h2 style="color: #60A5FA;">Comzilo Seller Onboarding</h2>
          <p>Hello Hemanth,</p>
          <p>Your Comzilo seller account has been approved!</p>
          <div style="background: #1E293B; padding: 15px; border-radius: 6px; border: 1px solid #3B82F6;">
            <p style="margin: 5px 0;"><strong>Store:</strong> Hemanth Trade Store</p>
            <p style="margin: 5px 0;"><strong>Login Email:</strong> hemanthgannamani@gmail.com</p>
            <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <code style="color: #60A5FA; background: #0F172A; padding: 4px 8px; border-radius: 4px;">Comzilo_SecurePass2026!</code></p>
            <p style="margin: 5px 0;"><strong>Login URL:</strong> <a href="http://localhost:5173/login" style="color: #60A5FA;">http://localhost:5173/login</a></p>
          </div>
          <p style="color: #F43F5E;">⚠️ Please change your password on first login.</p>
        </div>
      `,
    };

    console.log('Sending email to hemanthgannamani@gmail.com...');
    const info = await transporter.sendMail(mailOptions);
    console.log('=== EMAIL DISPATCH RESULT ===');
    console.log('Message ID:', info.messageId);
    console.log('Accepted Recipients:', info.accepted);
    console.log('Rejected Recipients:', info.rejected);
    console.log('SMTP Server Response:', info.response);
  } catch (err) {
    console.error('=== EMAIL DISPATCH FAILED ===', err);
  }

  process.exit(0);
}

debugDirectEmail();
