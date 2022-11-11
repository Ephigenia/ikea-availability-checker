import { Argument } from 'commander';
import { normalizeCountryCode, normalizeProductId } from './helper';


export const countryCode = new Argument(
  '[countryCodes...]',
  'list of country codes of which the stores should be shown'
).argParser<string[]>((value: string, previous: string[] = []) => {
  return [...previous, normalizeCountryCode(value)]
    .filter((cur, i, arr) => arr.indexOf(cur, i + 1) === -1);;
});

export const productIds = new Argument(
  '[productIds...]'
).argParser<string[]>((value: string, previous: string[] = []) => {
  return [...previous, normalizeProductId(value)]
    .filter((cur, i, arr) => arr.indexOf(cur, i + 1) === -1);;
});
