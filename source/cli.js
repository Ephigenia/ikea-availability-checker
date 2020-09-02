#!/usr/bin/env node
'use strict';

let program = require('commander');

let pkg = require('./../package.json');

program
  .version(pkg.version)
  .description(pkg.description)
  .command('stock', 'check the availability of one or multiple products', {
    executableFile: 'cli-stock',
  })
  .command('stores', 'list stores in a specific country', {
    executableFile: 'cli-stores',
  })
  .parse(process.argv);
