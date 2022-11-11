import { Command } from 'commander';
import * as pkg from './../../../package.json';

const program = new Command();
program
  .version(pkg.version)
  .description(pkg.description);


export {
  program
};
