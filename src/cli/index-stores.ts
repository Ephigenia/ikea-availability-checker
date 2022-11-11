import { program } from './lib/program';
import { findByCountryCode, Store, stores } from './../lib/stores';
import args from './lib/arguments';
import options from './lib/options';
import { show } from "./reporter/storesTable";

program
  .addArgument(args.countryCode)
  .addOption(options.plain)
  .addOption(options.pretty)
  .addOption(options.json)
  .description('List the IKEA stores found in the given country.')
  .addHelpText('after', `
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
`)
  .action((countryCodes: string[]) => {
    const options = program.opts();

    let foundStores: Store[] = stores;
    if (countryCodes && countryCodes.length) {
      foundStores = findByCountryCode(countryCodes);
    }

    let format = 'table';
    if (options.json) format = 'json';
    if (options.plain) format = 'tsv';
    if (options.pretty) format = 'table';

    let report: string;
    switch (format) {
      case 'json':
        report = JSON.stringify(foundStores, null, '  ');
        break;
      case 'tsv':
        report = foundStores.map((store) => [
            store.countryCode,
            store.country,
            store.buCode,
            store.name,
          ]
          .join('\t'))
          .join('\n');
        break;
      case 'table':
        report = show(foundStores);
        break;
    }
    process.stdout.write(report);
  })
  .parseAsync();
