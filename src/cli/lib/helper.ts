import { countryCode } from '../../lib/stores';

export const normalizeBuCode = function (buCode: string): string {
  return String(buCode || '').replace(/[^0-9]/g, '');
};

export const normalizeProductId = function(productId: string): string {
  return String(productId || '').replace(/[^0-9]+/gi, '').trim();
};

export const normalizeCountryCode = function(countryCode: countryCode): countryCode {
  return String(countryCode).trim().substring(0, 2).toLowerCase();
}
