export interface CountryCurrencyConfig {
  countryCode: string;
  currencyCode: string;
  name: string;
  locale: string;
  symbol: string;
  rateFromBase: number; // 1 Base (INR) = X Currency
  flag: string;
}

export const SUPPORTED_COUNTRIES: CountryCurrencyConfig[] = [
  { countryCode: 'IN', currencyCode: 'INR', name: 'India (₹ INR)', locale: 'en-IN', symbol: '₹', rateFromBase: 1.0, flag: '🇮🇳' },
  { countryCode: 'US', currencyCode: 'USD', name: 'United States ($ USD)', locale: 'en-US', symbol: '$', rateFromBase: 0.012, flag: '🇺🇸' },
  { countryCode: 'GB', currencyCode: 'GBP', name: 'United Kingdom (£ GBP)', locale: 'en-GB', symbol: '£', rateFromBase: 0.0093, flag: '🇬🇧' },
  { countryCode: 'EU', currencyCode: 'EUR', name: 'Europe (€ EUR)', locale: 'de-DE', symbol: '€', rateFromBase: 0.011, flag: '🇪🇺' },
  { countryCode: 'JP', currencyCode: 'JPY', name: 'Japan (¥ JPY)', locale: 'ja-JP', symbol: '¥', rateFromBase: 1.85, flag: '🇯🇵' },
  { countryCode: 'AU', currencyCode: 'AUD', name: 'Australia (A$ AUD)', locale: 'en-AU', symbol: 'A$', rateFromBase: 0.018, flag: '🇦🇺' },
];

export const getCountryConfig = (countryCode: string): CountryCurrencyConfig => {
  return SUPPORTED_COUNTRIES.find((c) => c.countryCode === countryCode) || SUPPORTED_COUNTRIES[0];
};

/**
 * Formats a base price stored in MySQL into a location-aware, locale-specific currency string.
 */
export const formatPrice = (amountInBase: number | string, countryCode: string = 'IN'): string => {
  const numericAmount = typeof amountInBase === 'string' ? parseFloat(amountInBase) : amountInBase;
  if (isNaN(numericAmount)) return '0.00';

  const config = getCountryConfig(countryCode);
  const convertedAmount = numericAmount * config.rateFromBase;

  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currencyCode,
      minimumFractionDigits: config.currencyCode === 'JPY' ? 0 : 2,
      maximumFractionDigits: config.currencyCode === 'JPY' ? 0 : 2,
    }).format(convertedAmount);
  } catch (_e) {
    return `${config.symbol}${convertedAmount.toFixed(2)}`;
  }
};
