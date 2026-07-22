export interface NotificationResult {
  success: boolean;
  messageId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response?: any;
  error?: string;
}

export interface EmailProvider {
  sendEmail(
    to: string,
    subject: string,
    body: string,
    payload?: Record<string, unknown>
  ): Promise<NotificationResult>;
}

export interface SMSProvider {
  sendSMS(to: string, body: string, payload?: Record<string, unknown>): Promise<NotificationResult>;
}

export interface PushProvider {
  sendPush(
    deviceToken: string,
    title: string,
    body: string,
    payload?: Record<string, unknown>
  ): Promise<NotificationResult>;
}

export interface WhatsAppProvider {
  sendWhatsApp(
    to: string,
    body: string,
    payload?: Record<string, unknown>
  ): Promise<NotificationResult>;
}
