import {
  EmailProvider,
  SMSProvider,
  PushProvider,
  WhatsAppProvider,
  NotificationResult,
} from './provider.interface';
import { logger } from '../../shared/logging/logger';

export class ManualNotificationProvider
  implements EmailProvider, SMSProvider, PushProvider, WhatsAppProvider
{
  public async sendEmail(
    to: string,
    subject: string,
    body: string,
    payload?: Record<string, unknown>
  ): Promise<NotificationResult> {
    logger.info(
      `[EmailProvider] Email sent to '${to}' | Subject: '${subject}' | Body: '${body.substring(0, 30)}'`,
      { payload }
    );
    return {
      success: true,
      messageId: `email-${Date.now()}`,
      response: { provider: 'manual', channel: 'email', deliveredAt: new Date().toISOString() },
    };
  }

  public async sendSMS(
    to: string,
    body: string,
    payload?: Record<string, unknown>
  ): Promise<NotificationResult> {
    logger.info(`[SMSProvider] SMS sent to '${to}' | Body: '${body}'`, { payload });
    return {
      success: true,
      messageId: `sms-${Date.now()}`,
      response: { provider: 'manual', channel: 'sms', deliveredAt: new Date().toISOString() },
    };
  }

  public async sendPush(
    deviceToken: string,
    title: string,
    body: string,
    payload?: Record<string, unknown>
  ): Promise<NotificationResult> {
    logger.info(
      `[PushProvider] Push notification sent to '${deviceToken}' | Title: '${title}' | Body: '${body.substring(0, 30)}'`,
      { payload }
    );
    return {
      success: true,
      messageId: `push-${Date.now()}`,
      response: { provider: 'manual', channel: 'push', deliveredAt: new Date().toISOString() },
    };
  }

  public async sendWhatsApp(
    to: string,
    body: string,
    payload?: Record<string, unknown>
  ): Promise<NotificationResult> {
    logger.info(`[WhatsAppProvider] WhatsApp message sent to '${to}' | Body: '${body}'`, {
      payload,
    });
    return {
      success: true,
      messageId: `wa-${Date.now()}`,
      response: { provider: 'manual', channel: 'whatsapp', deliveredAt: new Date().toISOString() },
    };
  }
}
