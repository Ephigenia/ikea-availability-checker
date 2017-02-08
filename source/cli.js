#!/usr/bin/env node
'use strict';

let program = require('commander');

let pkg = require('./../package.json');

program
  .version(pkg.version)
  .command('stock', 'check the availability of one or multiple products')
  .command('stores', 'list stores in a specific country')
  .parse(process.argv);
