import { getName } from "i18n-iso-countries";
import { normalizeCountryCode } from "../cli/lib/helper";
import { default as data } from "./../data/stores.json";

export interface Store {
  /** unique identifier of a store */
  buCode: buCode;
  /** name of the store */
  name: string;
  /** geo-coordinates of the store, longitude, latitude */
  coordinates: [number, number];
  /** alpha-2 country code */
  countryCode: countryCode;
  /** country name */
  country: string;
}

/** buCode unique ikea store identification number */
export type buCode = string;

/** ISO 3166-1 alpha 2 lowercase country code */
export type countryCode = string;

// create list of stores with typescript types and sorted by countryCode
// and buCode in ascending order
export const stores = (data as Store[])
  .map((store) => {
    store.country = getName(store.countryCode, "en");
    return store;
  })
  .sort((a, b): number => {
    // sort by countryCode and buCode ascending order
    return (
      a.countryCode.localeCompare(b.countryCode) +
      a.buCode.localeCompare(b.buCode)
    );
  });

/**
 * Find stores by matching the given query against the buCode, countryCode or
 * name of a store and return an array of all matching stores.
 */
export function findByQuery(
  /** query case insensitive search query */
  query: string | RegExp,
  /** optional additional countryCode that must match */
  countryCode: countryCode | null = null
): Store[] {
  const regexp =
    query instanceof RegExp ? query : new RegExp(String(query), "i");
  countryCode = countryCode ? normalizeCountryCode(countryCode) : countryCode;
  return stores
    .filter((d) => regexp.test(d.name) || d.buCode == query)
    .filter((d) => (countryCode ? d.countryCode === countryCode : true));
}

export function findById(buCodes: buCode | buCode[]): Store[] {
  if (!Array.isArray(buCodes)) buCodes = [buCodes];
  const codes = buCodes.map((c) => String(c));
  return stores.filter((store) => codes.indexOf(store.buCode) > -1);
}

export function findOneById(buCode: buCode): Store | undefined {
  return stores.find((store) => store.buCode == buCode);
}

export function findByCountryCode(
  countryCodes: countryCode | countryCode[]
): Store[] {
  if (!Array.isArray(countryCodes)) countryCodes = [countryCodes];
  const cc = countryCodes.map(normalizeCountryCode);
  return stores.filter((store) => cc.indexOf(store.countryCode) > -1);
}

/**
 * Returns an array with all ISO 3166-1 alpha 2 country codes that have at
 * least one store in alphabetical order.
 */
export function getCountryCodes(): countryCode[] {
  const countryCodes = stores.map((store) => store.countryCode);
  return Array.from(new Set(countryCodes)).sort((a, b) => a.localeCompare(b));
}

/**
 * Transforms a ISO 3166-2 country code like "gb" to the ISO 639-2
 * language code ("en") that is supported by the IOWS endpoint.
 */
export function getLanguageCode(countryCode: countryCode): string {
  const cc = normalizeCountryCode(countryCode);
  // the best matching language code to use when sending requests to a
  // specific country
  const map: Record<string, string> = {
    ae: "en",
    at: "de",
    au: "en",
    be: "fr",
    ca: "en",
    ch: "de",
    cn: "zh",
    cz: "cs",
    dk: "da",
    gb: "en",
    hk: "en",
    ie: "en",
    jo: "en",
    jp: "ja",
    kr: "ko",
    kw: "en",
    my: "en",
    qa: "en",
    sa: "en",
    se: "sv",
    sg: "en",
    th: "en",
    tw: "zh",
    us: "en",
  };
  return map[String(cc)] || cc;
}
