#!/usr/bin/env node
'use strict';

let program = require('commander');
const pkg = require('./../package.json');

const stores = require('./lib/stores');

// TODO search for store by city name?
// TODO search store with lat/lang
program
  .version(pkg.version)
  .arguments(
    '[countryCodes...]',
    {
      countryCode: 'list of country codes of which the stores should be shown'
    }
  )
  .description(
    'List the IKEA stores found in the given country.'
  )
  .option('--plain', 'output as tsv')
  .option('--json', 'json output')
  .option('--pretty', 'pretty table output (default)')
  .on('--help', function() {
    console.log(`
Examples:

  get all stores in a country
    ikea-availability-checker stores de

  get all stores from multiple countries
    ikea-availability-checker stores de at us

  print results as JSON
    ikea-availability-checker stores --json de

  get only the ids, the second column
    ikea-availability-checker stores --plain de | awk '{print $2}'
`);
  })
  .action(function(countryCodes) {
    const opts = program.opts();
    let format = 'table';
    if (opts.json) format = 'json';
    if (opts.plain) format = 'tsv';
    if (opts.pretty) format = 'table';

    const foundStores = [];
    countryCodes.forEach(countryCode => {
      stores.findByCountryCode(countryCode).forEach(store => foundStores.push(store));
    });

    let report;
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
        report = require('./lib/reporter/stores-table').show(foundStores);
        break;
    }
    console.log(report);
  })
  .parse(process.argv);
