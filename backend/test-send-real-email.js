const { SmtpService } = require('./dist/services/smtpService.js');

async function testSendEmail() {
  console.log('--- Testing SMTP Verification & Dispatch ---');
  const smtpService = new SmtpService();

  try {
    const isVerified = await smtpService.verifyConnection(1);
    console.log('SMTP Connection Verified Status:', isVerified);
  } catch (err) {
    console.error('SMTP Connection Failed:', err.message);
  }

  try {
    const result = await smtpService.sendEmail({
      tenantId: 1,
      to: 'hemanthgannamani@gmail.com',
      subject: 'Comzilo Seller Onboarding - Credentials Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; background: #FFFFFF;">
          <div style="background: #0F172A; padding: 24px; text-align: center;">
            <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: 800;">Comzilo Seller Portal</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #1E293B; margin-top: 0;">Welcome to Comzilo Platform!</h2>
            <p style="color: #475569; font-size: 15px; line-height: 1.6;">Your seller account has been approved by the Super Admin. Below are your temporary login credentials:</p>
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <p style="margin: 0 0 10px 0; color: #334155;"><strong>Login URL:</strong> <a href="http://localhost:5173/login" style="color: #2563EB;">http://localhost:5173/login</a></p>
              <p style="margin: 0 0 10px 0; color: #334155;"><strong>Email:</strong> hemanthgannamani@gmail.com</p>
              <p style="margin: 0; color: #334155;"><strong>Temporary Password:</strong> <code style="background: #E2E8F0; padding: 4px 8px; border-radius: 4px; font-weight: 700; color: #0F172A;">TempPass123!</code></p>
            </div>
            <p style="color: #E11D48; font-weight: 600; font-size: 14px;">⚠️ Security Notice: You must change your password immediately upon your first login.</p>
          </div>
        </div>
      `,
      templateName: 'seller_onboarding',
    });
    console.log('Email Sent Successfully! Message ID:', result.messageId);
  } catch (err) {
    console.error('Email Dispatch Error:', err.message);
  }

  process.exit(0);
}

testSendEmail().catch(err => {
  console.error(err);
  process.exit(1);
});
