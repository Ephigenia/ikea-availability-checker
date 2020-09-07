#!/usr/bin/env node
'use strict';

let program = require('commander');
const pkg = require('./../package.json');

const stores = require('./lib/stores');

program
  .version(pkg.version)
  .arguments(
    '[countryCodes...]',
    {
      countryCode: 'list of country codes of which the stores should be shown'
    }
  )
  .description(
    'Will list the IKEA stores found in the given country.'
  )
  .option(
    '-r, --reporter [reporter]',
    'define the reporter which should be used to print out the results, ' +
    'by default the results are shown as human readable tables grouped by ' +
    'country and product. Alternatively the results can be shown as plain ' +
    'JSON objects for further processing.',
    /^json|table$/,
    'table'
  )
  .on('--help', function() {
    console.log(`
Examples:

  get all stores in a country
    ikea-availability-checker stores de

  get all stores in >1 countries
    ikea-availability-checker stores de at us
`);
  })
  .action(function(countryCodes) {
    let reporter = null;
    switch (program.reporter) {
      case 'json':
        reporter = {
          show: (data) => {
            return JSON.stringify(data, null, "\t");
          }
        };
        break;
      case 'table':
        reporter = require('./lib/reporter/stores-' + program.reporter);
        break;
    }
    const foundStores = [];
    countryCodes.forEach(countryCode => {
      stores.findByCountryCode(countryCode).forEach(store => foundStores.push(store));
    });
    console.log(reporter.show(foundStores));
  })
  .parse(process.argv);
