import { countryCode } from "../../lib/stores";

export const normalizeBuCode = function (buCode: string): string {
  return String(buCode || "")
    .replace(/[^0-9]+/g, "")
    .trim();
};

export const normalizeProductId = function (productId: string): string {
  return String(productId || "")
    .replace(/[^0-9]+/g, "")
    .trim();
};

export const normalizeCountryCode = function (
  countryCode: countryCode
): countryCode {
  return String(countryCode).trim().substring(0, 2).toLowerCase();
};

export const unique = function (cur: unknown, i: number, arr: unknown[]) {
  return arr.indexOf(cur, i + 1) === -1;
};
