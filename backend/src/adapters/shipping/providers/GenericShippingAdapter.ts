import { BaseShippingAdapter } from './BaseShippingAdapter';

export class GenericShippingAdapter extends BaseShippingAdapter {
  providerCode: string;
  providerName: string;

  constructor(code: string, name: string) {
    super();
    this.providerCode = code;
    this.providerName = name;
  }
}

export const PROVIDER_ADAPTER_MAP: Record<string, { name: string }> = {
  shiprocket: { name: 'Shiprocket' },
  shiprocket_local: { name: 'Shiprocket Local' },
  delhivery: { name: 'Delhivery' },
  dtdc: { name: 'DTDC' },
  blue_dart: { name: 'Blue Dart' },
  dhl: { name: 'DHL Express' },
  fedex: { name: 'FedEx' },
  ups: { name: 'UPS' },
  xpressbees: { name: 'XpressBees' },
  ecom_express: { name: 'Ecom Express' },
  india_post: { name: 'India Post' },
  amazon_shipping: { name: 'Amazon Shipping' },
  shadowfax: { name: 'Shadowfax' },
  nimbuspost: { name: 'NimbusPost' },
  porter: { name: 'Porter' },
  borzo: { name: 'Borzo' },
  aramex: { name: 'Aramex' },
  custom_provider: { name: 'Custom Provider' },
};
