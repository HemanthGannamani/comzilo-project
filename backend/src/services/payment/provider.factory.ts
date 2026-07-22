import { IPaymentProvider } from './provider.interface';
import { ManualPaymentProvider } from './manual.provider';

export class PaymentProviderFactory {
  public static getProvider(gateway: string): IPaymentProvider {
    switch (gateway.toLowerCase()) {
      case 'manual':
      default:
        return new ManualPaymentProvider();
    }
  }
}
