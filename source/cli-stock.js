#!/usr/bin/env node
'use strict';

let program = require('commander');
const storesData = require('./lib/stores');

let pkg = require('./../package.json');
let IOWS2 = require('./lib/iows2.js');

function optionalSplitOptionCSV(val) {
  const seperator = ',';
  if (val.indexOf(seperator) === -1) {
    return val;
  }
  return val.split(seperator)
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
    'optional single country code or multiple country codes separated by comma'
  )
  .option(
    '-r, --reporter [reporter]',
    'define the reporter which should be used to print out the results, ' +
    'by default the results are shown as human readable tables grouped by ' +
    'country and product. Alternatively the results can be shown as plain ' +
    'JSON objects for further processing.',
    /^json|table|csv$/,
    'table'
  )
  // TODO add option where name of store is matched against --store /Berlin/
  .option(
    '-s, --store [storeIds ...|regexp]',
    'optional single or multiple comma seperated ikea store ids (bu-codes) ' +
    'where of which the product stock availability should get checked',
    optionalSplitOptionCSV,
    ''
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
    let stores = [];
    if (!program.store && program.country) {
      stores = storesData.findByCountryCode(program.country);
    } else if (Array.isArray(program.store)) {
      stores = storesData.getStoresById(program.store);
    } else if (program.store) {
      stores = storesData.findByQuery(program.store, program.country);
    } else {
      console.error('please provide country code and/or store id');
      process.exit(1);
    }

    if (stores.length === 0) {
      console.log('no stores found');
      process.exit(1);
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
      const iows = new IOWS2(store.countryCode);
      return iows.getStoreProductAvailability(store.buCode, productId)
        // softly continue the promise chain when there’s just a 404 (not found)
        .catch(err => {
          // when product could not be found return an empty availability
          if (err.response && err.response.status === 404) {
            return { stock: 0, probability: 'NOT_FOUND', createdAt: new Date() };
          }
          throw err;
        })
        .then((availability) => ({
          productId,
          store,
          availability
        })
      )
    });

    Promise.all(promises)
      .then(results => console.log(reporter.createReport(results)))
  })
  .parse(process.argv);
