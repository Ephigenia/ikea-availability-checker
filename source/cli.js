#!/usr/bin/env node

import fs from 'node:fs';
import program from 'commander';

let pkg = JSON.parse(fs.readFileSync('package.json'));

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
