#!/usr/bin/env node
'use strict';

let program = require('commander');

let pkg = require('./../package.json');
let iows = require('./lib/iows.js');

program
  .version(pkg.version)
  .arguments('[productIds...]')
  .description(
    'Can be used to request the availability of one or multiple products ' +
    'in specific countries and/or stores. Use the options to filter the ' +
    'results.'
  )
  .option(
    '-s, --store [storeIds]',
    'optional single or multiple comma seperated ikea store ids (bu-codes) ' +
    'where of which the product stock availability should get checked',
    function(val) {
      return val.split(/\s*[,]+\s*/).filter(function(cur, i, arr) {
        return arr.indexOf(cur, i + 1) === -1;
      });
    }
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
  .option(
    '-c, --country [countryCodes ...]',
    'optional single country id or multiple country ids separated by comma, ' +
    'default value is "de" which would list the availability for all stores ' +
    'in germany',
    function(val) {
      return val.split(/\s*[,]+\s*/).filter(function(cur, i, arr) {
        return arr.indexOf(cur, i + 1) === -1;
      });
    },
    'de'
  )
  .action(function(productIds) {
    let storeIds = program.store;
    let countryCodes = program.country;

    let reporter = require('./lib/reporter/stock-' + program.reporter);

    // make productIds unique
    productIds.filter(function(cur, i, arr) {
      return arr.indexOf(cur, i + 1) === -1;
    });

    productIds.forEach(function(productId) {
      // @TODO use country filtering option
      countryCodes.forEach(function(countryCode) {
        iows.country(countryCode).product(productId).availability(
          function(err, results) {
            if (err) {
              if (err.response.statusCode === 404) {
                console.error('Product with id %s not found.', productId);
                return;
              }
              throw err;
            }
            // remove those results which are not whitelisted in the store ids
            // array
            results = results.filter(function(item) {
              return (!storeIds || storeIds.length === 0) ||
                storeIds.indexOf(item.buCode) > -1;
            });
            let str = reporter.show({
              countryCode: countryCode,
              productId: productId,
              results: results,
            });
            console.log(str);
          }
        );
      });
    });
  })
  .parse(process.argv);
