#!/usr/bin/env node

let program = require('commander');

let pkg = require('./../package.json');
let iows = require('./lib/iows.js');

// @TODO add command for listing stores in countries
// cli.js list-stores --country=<code>
//
// @TODO add command to get product details
// cli.js product-info 90205912 (for getting name, sizes, colors?)
//
// @TODO add json option to output as json
//       output options: JSON, Table

program
  .version(pkg.version)
  .usage('[options] <productIds>')
  .option(
    '-s, --store <storeIds>',
    'optional single or multiple comma seperated ikea store ids (bu-codes) ' +
    'where of which the product stock availability should get checked',
    function(val) {
      return val.split(/\s*[,]+\s*/);
    }
  )
  .option(
    '-c, --country <countryCodes>',
    'optional single country id or multiple country ids separated by comma',
    function(val) {
      return val.split(/\s*[,]+\s*/);
    }
  )
  .parse(process.argv)

// create list of countries to check
// create list of stores to check
// perform requests
// print report grouped by productId, countryCode
let productIds = program.args;
let storeIds = program.store;

productIds.forEach((productId) => {
  iows.country('de').product(productId).availability(function(err, results) {
    // remove those results which are not whitelisted in the store ids array
    results = results.filter(function(item) {
      return (!storeIds || storeIds.length === 0) ||
        storeIds.indexOf(item.buCode) > -1;
    });

    console.log(JSON.stringify(results));
  });
});
