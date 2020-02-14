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
    'Will list the IKEA stores found in a country by scraping an example ' +
    'detail page from ikea.com or other domains and extracting the store ' +
    'buCodes and names'
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
  .action(function(countryCodes) {
    let reporter = null;
    switch (program.reporter) {
      case 'json':
        reporter = require('./lib/reporter/' + program.reporter);
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
