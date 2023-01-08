import { Option } from "commander";

export const country = new Option(
  "-c, --country [countryCode]",
  "optional single country code or multiple country codes separated by comma"
);

export const json = new Option("--json", "output as JSON");

export const minStock = new Option(
  "--min-stock [amount=0]",
  "filter out all stores which don’t meet the minimum amount"
).default(0);

export const plain = new Option("--plain", "output as tsv");

export const pretty = new Option("--pretty", "pretty table output (default)");

export const store = new Option(
  "-s, --store <storeIds ...|regexp>",
  "optional single or multiple comma seperated ikea store ids (bu-codes) " +
    "where of which the product stock availability should get checked"
).argParser((value: string): string[] | string => {
  const seperator = ",";
  if (value.indexOf(seperator) === -1) {
    return value;
  }
  return (
    value
      .split(seperator)
      // trim all valueues
      .map((value) => value.trim())
      // make unique
      .filter((cur, i, arr) => arr.indexOf(cur, i + 1) === -1)
  );
});
