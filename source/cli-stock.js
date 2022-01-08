#!/usr/bin/env node

import program from 'commander';
import storesData from './lib/stores.js';

import IOWS2 from './lib/iows2.js';
import { IOWS2DeprecatedError, IOWS2NotFoundError, IOWS2ParseError } from './lib/iows2Errors.js';

import ReporterJSON from './lib/reporter/stock-json.js';
import ReporterTSV from './lib/reporter/stock-tsv.js';
import ReporterTable from './lib/reporter/stock-table.js';

// TODO output only those that have stock
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
    '--min-stock [amount=0]',
    'filter out all stores which don’t meet the minimum amount',
    0,
  )
  .option('--plain', 'output as tsv')
  .option('--json', 'json output')
  .option('--pretty', 'pretty table (default)')
  .option(
    '-s, --store [storeIds ...|regexp]',
    'optional single or multiple comma seperated ikea store ids (bu-codes) ' +
    'where of which the product stock availability should get checked',
    optionalSplitOptionCSV,
    ''
  )
  .addHelpText('after', `
Examples:

  query single product in single store
    ikea-availability-checker stock --store 148 40299687

  query multiple products in a single store
    ikea-availability-checker stock --store 148 40299687 S69022537

  query single product in multiple stores
    ikea-availability-checker stock --store 148,328 40299687

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
`)
  .action((productIds = []) => {
    // filter all dublicate productIds
    // @var {Array<String>}
    productIds = productIds.filter(function(cur, i, arr) {
      return arr.indexOf(cur, i + 1) === -1;
    });

    // TODO when empty countryCodes, use countries derived from store id and
    // store
    const opts = program.opts();
    let stores = [];
    if (!opts.store && opts.country) {
      stores = storesData.findByCountryCode(opts.country);
    } else if (Array.isArray(opts.store)) {
      stores = storesData.findById(opts.store);
    } else if (opts.store) {
      stores = storesData.findByQuery(opts.store, opts.country);
    } else {
      console.error('please provide country code and/or store id');
      process.exit(1);
    }

    if (stores.length === 0) {
      console.log('no stores found');
      process.exit(1);
    }

    let reporter = ReporterTable;
    if (opts.json) reporter = ReporterJSON;
    if (opts.plain) reporter = ReporterTSV;

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
          if (err instanceof IOWS2ParseError) {
            return { stock: 0, probability: 'PARSE_ERROR', createdAt: new Date() };
          }
          if (err instanceof IOWS2NotFoundError) {
            return { stock: 0, probability: 'NOT_FOUND', createdAt: new Date() };
          }
          if (err instanceof IOWS2DeprecatedError) {
            return { stock: 0, probability: 'DEPRECATED', createdAt: new Date() };
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
      .then(results => results.filter(item => item.availability.stock >= opts.minStock))
      .then(results => reporter.createReport(results))
      .then(report => console.log(report))
  })
  .parse(process.argv);
