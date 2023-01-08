import { Argument } from "commander";
import { normalizeCountryCode, normalizeProductId, unique } from "./helper";

export const countryCode = new Argument(
  "[countryCodes...]",
  "list of country codes of which the stores should be shown"
).argParser<string[]>((value: string, previous: string[] = []) => {
  return [...previous, normalizeCountryCode(value)].filter(unique);
});

export const productIds = new Argument("[productIds...]").argParser<string[]>(
  (value: string, previous: string[] = []) => {
    return [...previous, normalizeProductId(value)].filter(unique);
  }
);
