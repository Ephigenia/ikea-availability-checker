#!/usr/bin/env node
'use strict';

let program = require('commander');
const storesData = require('./lib/stores');

let pkg = require('./../package.json');
let IOWS2 = require('./lib/iows2.js');

function optionalSplitOptionCSV(val) {
  return val.split(/\s*[,]+\s*/)
    // trim all values
    .map(val => val.trim())
    // make unique
    .filter((cur, i, arr) => arr.indexOf(cur, i + 1) === -1);
}

program
  .version(pkg.version)
  .arguments('[productIds...]')
  .description(
    'Can be used to request the availability of one or multiple products ' +
    'in specific countries and/or stores. Use the options to filter the ' +
    'results.'
  )
  .option(
    '-c, --country [countryCode]',
    'optional single country id or multiple country ids separated by comma, ' +
    'default value is "de" which would list the availability for all stores ' +
    'in germany',
    'de'
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
    '-s, --store [storeIds ...]',
    'optional single or multiple comma seperated ikea store ids (bu-codes) ' +
    'where of which the product stock availability should get checked',
    optionalSplitOptionCSV
  )
  .action((productIds = []) => {
    // filter all dublicate productIds
    // @var {Array<String>}
    productIds = productIds.filter(function(cur, i, arr) {
      return arr.indexOf(cur, i + 1) === -1;
    });

    // TODO when empty countryCodes, use countries derived from store id and
    // store
    // @var {String}
    const countryCode = program.country;
    let stores = storesData.getStoresById(program.store);
    if (!program.store) {
      stores = storesData.getStoresForCountry(countryCode)
    }

    let reporter = null;
    if (program.reporter === 'json') {
      reporter = require('./lib/reporter/' + program.reporter);
    } else {
      reporter = require('./lib/reporter/stock-' + program.reporter);
    }

    // merge productids and stores list together to one array to be able
    // to make one request per array item
    const data = productIds.map(productId => {
      return stores.map(store => ({ productId, store }))
    });
    const flat = [].concat.apply([], data);

    const promises = flat.map(
      /**
       * @param {Object} row
       * @param {String} row.productId
       * @param {import('./lib/stores').Store} row.store
       */
      ({ store, productId }) => {
      const iows = new IOWS2(countryCode);
      return iows.getStoreProductAvailability(store.buCode, productId)
        .then((availability) => ({
          productId,
          store,
          availability
        }))
    })

    Promise.all(promises)
      .then(results => console.log(reporter.createReport(results)))
  })
  .parse(process.argv);
