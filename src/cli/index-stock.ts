import { program } from './lib/program';

program
  .action(() => {
    console.log('stock');
  })
  .parseAsync();
