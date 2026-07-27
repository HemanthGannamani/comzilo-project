/* eslint-disable @typescript-eslint/no-explicit-any */
import { IWhatsAppProvider } from './provider.interface';
import { MetaWhatsAppCloudProvider } from './metaCloud.provider';

export class WhatsAppProviderFactory {
  public static getProvider(providerType: string = 'meta_cloud', config?: any): IWhatsAppProvider {
    switch (providerType.toLowerCase()) {
      case 'twilio':
      case 'gupshup':
      case 'interakt':
      case 'msg91':
      case '360dialog':
      case 'meta_cloud':
      default:
        return new MetaWhatsAppCloudProvider(config);
    }
  }
}
