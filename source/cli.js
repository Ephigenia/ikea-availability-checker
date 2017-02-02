#!/usr/bin/env node

let program = require('commander');

let pkg = require('./../package.json');

program
  .version(pkg.version)
  .command('stock', 'check the availability of one or multiple products')
  .parse(process.argv);
