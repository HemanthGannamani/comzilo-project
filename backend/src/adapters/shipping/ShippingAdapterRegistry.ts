import { IShippingProviderAdapter } from './IShippingProviderAdapter';
import { GenericShippingAdapter, PROVIDER_ADAPTER_MAP } from './providers/GenericShippingAdapter';

export class ShippingAdapterRegistry {
  private static adapters: Map<string, IShippingProviderAdapter> = new Map();

  public static getAdapter(providerCode: string): IShippingProviderAdapter {
    const normalizedCode = providerCode.toLowerCase().trim();

    if (this.adapters.has(normalizedCode)) {
      return this.adapters.get(normalizedCode)!;
    }

    const providerInfo = PROVIDER_ADAPTER_MAP[normalizedCode] || {
      name: normalizedCode.toUpperCase(),
    };

    const adapter = new GenericShippingAdapter(normalizedCode, providerInfo.name);
    this.adapters.set(normalizedCode, adapter);
    return adapter;
  }

  public static registerAdapter(providerCode: string, adapter: IShippingProviderAdapter): void {
    this.adapters.set(providerCode.toLowerCase().trim(), adapter);
  }
}
