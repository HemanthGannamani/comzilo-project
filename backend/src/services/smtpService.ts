/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import { sequelize } from '../config/database';
import { QueryTypes } from 'sequelize';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.SMTP_ENCRYPTION_KEY || 'comzilo-smtp-secret-key-32-bytes!'; // 32 chars
const IV_LENGTH = 16;

export interface SmtpConfig {
  host: string;
  port: number;
  username: string;
  password?: string;
  encryption?: 'tls' | 'ssl' | 'none';
  senderName?: string;
  senderEmail?: string;
  providerType?: string;
}

export class SmtpService {
  /**
   * Encrypt SMTP Password before saving to MySQL
   */
  public static encryptPassword(text: string): string {
    if (!text) return '';
    try {
      const iv = crypto.randomBytes(IV_LENGTH);
      const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return iv.toString('hex') + ':' + encrypted;
    } catch {
      return text; // Fallback
    }
  }

  /**
   * Decrypt SMTP Password from MySQL
   */
  public static decryptPassword(text: string): string {
    if (!text) return '';
    if (!text.includes(':')) return text; // Plaintext fallback
    try {
      const textParts = text.split(':');
      const iv = Buffer.from(textParts.shift()!, 'hex');
      const encryptedText = textParts.join(':');
      const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch {
      return text;
    }
  }

  /**
   * Get active SMTP Transporter for a Tenant
   */
  public async getTransporter(tenantId: number, overrideConfig?: SmtpConfig): Promise<{ transporter: nodemailer.Transporter; senderName: string; senderEmail: string }> {
    let config: SmtpConfig | null = overrideConfig || null;

    if (!config) {
      const [row]: any = await sequelize.query(
        'SELECT * FROM marketing_email_providers WHERE tenant_id = :tenantId AND status = "active" LIMIT 1',
        { replacements: { tenantId }, type: QueryTypes.SELECT }
      );

      if (row && row.config_json) {
        try {
          const parsed = typeof row.config_json === 'string' ? JSON.parse(row.config_json) : row.config_json;
          config = {
            host: parsed.host || parsed.smtpHost,
            port: Number(parsed.port || parsed.smtpPort || 587),
            username: parsed.username || parsed.smtpUser,
            password: SmtpService.decryptPassword(parsed.password || parsed.smtpPass),
            encryption: parsed.encryption || (Number(parsed.port) === 465 ? 'ssl' : 'tls'),
            senderName: parsed.senderName || parsed.fromName || 'Comzilo Merchant',
            senderEmail: parsed.senderEmail || parsed.fromEmail || parsed.username,
            providerType: row.provider_type || 'smtp',
          };
        } catch (e) {
          console.warn('[SmtpService] Failed to parse config_json:', e);
        }
      }
    }

    // Default Ethereal / Test SMTP fallback if no seller SMTP is configured yet
    if (!config || !config.host) {
      const testAccount = await nodemailer.createTestAccount();
      const testTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      return {
        transporter: testTransporter,
        senderName: 'Comzilo Store',
        senderEmail: testAccount.user,
      };
    }

    const isSecure = config.encryption === 'ssl' || config.port === 465;
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: isSecure,
      auth: {
        user: config.username,
        pass: config.password,
      },
      tls: {
        rejectUnauthorized: false, // Prevent self-signed cert blocks in test/dev
      },
    });

    return {
      transporter,
      senderName: config.senderName || 'Comzilo Merchant',
      senderEmail: config.senderEmail || config.username,
    };
  }

  /**
   * Test Connection Endpoint Functionality
   */
  public async verifyConnection(tenantId: number, config?: SmtpConfig): Promise<boolean> {
    const { transporter } = await this.getTransporter(tenantId, config);
    await transporter.verify();
    return true;
  }

  /**
   * Send Real Email & Log to MySQL
   */
  public async sendEmail(params: {
    tenantId: number;
    to: string;
    subject: string;
    html: string;
    templateName?: string;
    providerType?: string;
    overrideConfig?: SmtpConfig;
  }): Promise<{ success: boolean; messageId: string }> {
    const { tenantId, to, subject, html, templateName = 'general', providerType = 'smtp', overrideConfig } = params;

    let transporter: nodemailer.Transporter;
    let senderName: string;
    let senderEmail: string;

    try {
      const transportRes = await this.getTransporter(tenantId, overrideConfig);
      transporter = transportRes.transporter;
      senderName = transportRes.senderName;
      senderEmail = transportRes.senderEmail;
    } catch (err: any) {
      // Log failure in marketing_email_logs
      await this.logEmail({
        tenantId,
        recipient: to,
        subject,
        templateName,
        providerType,
        status: 'failed',
        failureReason: `Transporter Initialization Error: ${err.message}`,
      });
      throw new Error(`SMTP Setup Error: ${err.message}`);
    }

    try {
      const info = await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to,
        subject,
        html,
      });

      const messageId = info.messageId || `msg_${Date.now()}`;

      // Log success in marketing_email_logs
      await this.logEmail({
        tenantId,
        recipient: to,
        subject,
        templateName,
        providerType,
        status: 'sent',
        messageId,
        sentAt: new Date(),
      });

      return { success: true, messageId };
    } catch (err: any) {
      const errorMsg = err.response || err.message || String(err);
      // Log failure in marketing_email_logs
      await this.logEmail({
        tenantId,
        recipient: to,
        subject,
        templateName,
        providerType,
        status: 'failed',
        failureReason: errorMsg,
      });

      throw new Error(`SMTP Dispatch Failure: ${errorMsg}`);
    }
  }

  /**
   * Send Real Test Email (Feature 1 Workflow)
   */
  public async sendTestEmail(tenantId: number, recipientEmail: string, config?: SmtpConfig): Promise<{ success: boolean; messageId: string }> {
    const testSubject = 'Comzilo SMTP Test Email';
    const testHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #4F46E5; margin-bottom: 10px;">✅ Connection Successful!</h2>
        <p>This is a test email sent from your <strong>Comzilo Marketing Module</strong> to verify your SMTP server configuration.</p>
        <div style="background: #F3F4F6; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #4B5563;"><strong>Recipient:</strong> ${recipientEmail}</p>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #4B5563;"><strong>Sent Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <p style="font-size: 13px; color: #6B7280;">If you received this email in your Inbox or Spam folder, your SMTP setup is working correctly!</p>
      </div>
    `;

    return this.sendEmail({
      tenantId,
      to: recipientEmail,
      subject: testSubject,
      html: testHtml,
      templateName: 'test_email',
      overrideConfig: config,
    });
  }

  /**
   * Log Email to MySQL database
   */
  private async logEmail(logData: {
    tenantId: number;
    recipient: string;
    subject: string;
    templateName: string;
    providerType: string;
    status: string;
    retryCount?: number;
    failureReason?: string;
    messageId?: string;
    sentAt?: Date;
  }): Promise<void> {
    try {
      await sequelize.query(
        `INSERT INTO marketing_email_logs (
          tenant_id, store_id, recipient, subject, template_name, provider_type, 
          status, retry_count, failure_reason, message_id, sent_at, created_at, updated_at
        ) VALUES (
          :tenantId, 1, :recipient, :subject, :templateName, :providerType, 
          :status, :retryCount, :failureReason, :messageId, :sentAt, NOW(), NOW()
        )`,
        {
          replacements: {
            tenantId: logData.tenantId,
            recipient: logData.recipient,
            subject: logData.subject,
            templateName: logData.templateName,
            providerType: logData.providerType,
            status: logData.status,
            retryCount: logData.retryCount || 0,
            failureReason: logData.failureReason || null,
            messageId: logData.messageId || null,
            sentAt: logData.sentAt ? logData.sentAt.toISOString().slice(0, 19).replace('T', ' ') : null,
          },
        }
      );
    } catch (dbErr) {
      console.error('[SmtpService] Failed to insert email log into DB:', dbErr);
    }
  }
}
