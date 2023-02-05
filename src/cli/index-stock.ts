#!/usr/bin/env node

import { program } from "./lib/program";
import { productIds } from "./lib/arguments";
import * as options from "./lib/options";
import { availabilities } from "..";
import { findByCountryCode, findById, findByQuery, Store } from "../lib/stores";
import { createStockInfoReportTable } from "./reporter/stockTable";

program
  .addArgument(productIds.argRequired())
  .addOption(options.country)
  .addOption(options.plain)
  .addOption(options.pretty)
  .addOption(options.json)
  .addOption(options.store)
  .addOption(options.minStock)
  .description(
    "Can be used to request the availability of one or multiple products " +
      "in specific countries and/or stores. Use the options to filter the " +
      "results."
  )
  .addHelpText(
    "after",
    `
Examples:

  query single product in single store
    ikea-availability-checker stock --store 174 40299687

  query multiple products in a single store
    ikea-availability-checker stock --store 174 40299687 S69022537

  query single product in multiple stores
    ikea-availability-checker stock --store 174,328 40299687

  query single product in all stores in a country
    ikea-availability-checker stock --country=at 40299687

  query single product by matching city name
    ikea-availability-checker stock --store Berlin 40299687

  show only stores with min 2 items in stock
    ikea-availability-checker stock --min-store 2 --store Berlin 40299687

  output as json
    ikea-availability-checker stock --store 148 --json 40299687

  output with aligned columns
    ikea-availability-checker stock --store Frankfurt --plain 40299687 | column -t
  `
  )
  .action(async (productIds: string[]) => {
    const opts = program.opts();

    let format = "table";
    if (opts.json) format = "json";
    if (opts.plain) format = "tsv";
    if (opts.pretty) format = "table";

    let stores: Store[];
    if (!opts.store && opts.country) {
      stores = findByCountryCode(opts.country);
    } else if (Array.isArray(opts.store)) {
      stores = findById(opts.store);
    } else if (opts.store) {
      stores = findByQuery(opts.store);
    } else {
      throw new Error("please provide country code and/or store id");
    }

    const data = await availabilities(stores, productIds);

    // only show items with at least "amount" items in stock
    const displayedData = data.filter(
      (availability) => availability.stock >= opts.minStock
    );

    let report: string;
    switch (format) {
      case "json":
        report = JSON.stringify(displayedData);
        break;
      case "tsv":
        report = displayedData
          .map((availability) =>
            [
              availability.createdAt?.toISOString(),
              availability.productId,
              availability.store.countryCode,
              availability.store.country,
              availability.store.buCode,
              availability.store.name,
              availability.stock,
              availability.probability,
              availability.restockDate?.toISOString(),
            ].join("\t")
          )
          .join("\n");
        break;
      default:
      case "table":
        report = createStockInfoReportTable(displayedData).toString();
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
