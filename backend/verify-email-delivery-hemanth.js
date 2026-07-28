const { SmtpService } = require('./dist/services/smtpService.js');

async function testHemanthEmailDelivery() {
  console.log('================ STEP 9: TEST EMAIL DELIVERY TO HEMANTHGANNAMANI@GMAIL.COM ================');
  const smtpService = new SmtpService();

  const recipientEmail = 'hemanthgannamani@gmail.com';
  const ownerName = 'Hemanth Gannamani';
  const storeName = 'Hemanth Multi-Tenant Store';
  const tempPassword = 'Comzilo_7f3d9a!';
  const loginUrl = 'http://localhost:5173/login';

  console.log(`Connecting to SMTP server...`);
  const isVerified = await smtpService.verifyConnection(1);
  console.log(`SMTP Server Verification: ${isVerified ? 'VERIFIED_OK' : 'FAILED'}`);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to Comzilo Platform</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #F1F5F9;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
        <tr>
          <td style="background: #0F172A; padding: 30px; text-align: center;">
            <h1 style="color: #FFFFFF; margin: 0; font-size: 26px;">Comzilo Seller Portal</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #0F172A; margin-top: 0;">Welcome, ${ownerName}! 🎉</h2>
            <p style="color: #475569; font-size: 15px;">Your seller application for <strong>${storeName}</strong> has been officially approved by the Comzilo Super Admin team.</p>
            <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #0F172A;">Your Merchant Credentials:</h3>
              <p style="margin: 5px 0;"><strong>Store:</strong> ${storeName}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${recipientEmail}</p>
              <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <code style="background: #E2E8F0; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${tempPassword}</code></p>
              <p style="margin: 5px 0;"><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
            </div>
            <p style="color: #E11D48; font-weight: bold;">⚠️ Mandatory Security Notice: You must change your password immediately upon first login.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  console.log(`Dispatching test onboarding email to ${recipientEmail}...`);
  const dispatchRes = await smtpService.sendEmail({
    tenantId: 1,
    to: recipientEmail,
    subject: `Comzilo Seller Credentials Verification - ${storeName}`,
    html: htmlContent,
    templateName: 'seller_onboarding',
  });

  console.log(`Email Delivered Successfully!`);
  console.log(`Message ID: ${dispatchRes.messageId}`);
  console.log(`Recipient: ${recipientEmail}`);
  console.log('====================================================================================');

  process.exit(0);
}

testHemanthEmailDelivery().catch(err => {
  console.error('Email delivery failed:', err);
  process.exit(1);
});
