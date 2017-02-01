#!/usr/bin/env node

let program = require('commander');

let pkg = require('./../package.json');


// @TODO add command for listing stores in countries
// cli.js list-stores --country=<code>
//
// @TODO add command to list / search for productIds
//       http://www.ikea.com/de/de/catalog/productsaz/0/
//       0 = A
//       25 = Z
//
// @TODO add command to get product details
// cli.js product-info 90205912 (for getting name, sizes, colors?)
//
// @TODO add json option to output as json
//       output options: JSON, Table

program
  .version(pkg.version)
  .command('stock', 'check the availability of one or multiple products')
  .parse(process.argv);
