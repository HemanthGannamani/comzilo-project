/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IWhatsAppProvider, WhatsAppMessageResponse } from './provider.interface';

export class MetaWhatsAppCloudProvider implements IWhatsAppProvider {
  private phoneNumberId: string;
  private accessToken: string;

  constructor(config?: any) {
    this.phoneNumberId = config?.phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID || 'mock_phone_num_id_100293';
    this.accessToken = config?.accessToken || process.env.WHATSAPP_ACCESS_TOKEN || 'mock_whatsapp_token_xyz987';
  }

  public async testConnection(_config?: any): Promise<boolean> {
    return true;
  }

  public async sendTextMessage(to: string, _message: string, _options?: any): Promise<WhatsAppMessageResponse> {
    const msgId = `wmid.HBgL_${Date.now()}_${Math.floor(10000 + Math.random() * 90000)}`;
    return {
      success: true,
      messageId: msgId,
      providerReference: `meta_${msgId}`,
      status: 'sent',
      rawResponse: {
        messaging_product: 'whatsapp',
        contacts: [{ input: to, wa_id: to.replace(/[^0-9]/g, '') }],
        messages: [{ id: msgId }],
        phone_id: this.phoneNumberId,
        token_preview: this.accessToken.substring(0, 5),
      },
    };
  }

  public async sendTemplateMessage(
    _to: string,
    templateName: string,
    parameters: Record<string, any>,
    _options?: any
  ): Promise<WhatsAppMessageResponse> {
    const msgId = `wmid.HBgL_${Date.now()}_${Math.floor(10000 + Math.random() * 90000)}`;
    return {
      success: true,
      messageId: msgId,
      providerReference: `meta_tpl_${msgId}`,
      status: 'sent',
      rawResponse: {
        messaging_product: 'whatsapp',
        template: { name: templateName, parameters },
        messages: [{ id: msgId }],
      },
    };
  }
}
