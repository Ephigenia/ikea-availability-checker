#!/usr/bin/env node

import { program } from "./lib/program";
import { findByCountryCode, Store, stores } from "./../lib/stores";
import { countryCode } from "./lib/arguments";
import * as options from "./lib/options";
import { createStoresReportTable } from "./reporter/storesTable";

program
  .addArgument(countryCode)
  .addOption(options.plain)
  .addOption(options.pretty)
  .addOption(options.json)
  .description("List the IKEA stores found in the given country.")
  .addHelpText(
    "after",
    `
Examples:

  get all stores in a country
    ikea-availability-checker stores de

  get all stores from multiple countries
    ikea-availability-checker stores de at us

  print results as JSON
    ikea-availability-checker stores --json de

  get only the ids, the second column
    ikea-availability-checker stores --plain de | awk '{print $2}'

  get all stores
    ikea-availability-checker stores

  count all stores
    ikea-availability-checker stores --plain | wc -l

  get all store country codes, sorted asc
    ikea-availability-checker stores --plain | awk '{print $1} | uniq | sort
`
  )
  .action((countryCodes: string[]) => {
    const opts = program.opts();

    let foundStores: Store[] = stores;
    if (countryCodes && countryCodes.length) {
      foundStores = findByCountryCode(countryCodes);
    }

    let format = "table";
    if (opts.json) format = "json";
    if (opts.plain) format = "tsv";
    if (opts.pretty) format = "table";

    let report: string;
    switch (format) {
      case "json":
        report = JSON.stringify(foundStores);
        break;
      case "tsv":
        report = foundStores
          .map((store) =>
            [store.countryCode, store.country, store.buCode, store.name].join(
              "\t"
            )
          )
          .join("\n");
        break;
      default:
      case "table":
        report = createStoresReportTable(foundStores).toString();
        break;
    }
    process.stdout.write(report);
  });

program.parseAsync()
  .catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(message + "\n");
    process.exit(1);
  });
