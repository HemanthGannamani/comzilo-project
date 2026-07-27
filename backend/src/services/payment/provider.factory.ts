import { IPaymentProvider } from './provider.interface';
import { ManualPaymentProvider } from './manual.provider';
import { RazorpayPaymentProvider } from './razorpay.provider';

export class PaymentProviderFactory {
  public static getProvider(gateway: string): IPaymentProvider {
    switch (gateway.toLowerCase()) {
      case 'razorpay':
        return new RazorpayPaymentProvider();
      case 'manual':
      case 'cod':
      default:
        return new ManualPaymentProvider();
    }
  }
}
