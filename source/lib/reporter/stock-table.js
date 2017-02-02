'use strict';

let Table = require('cli-table');
let chalk = require('chalk');

module.exports = {
  show: function(data) {
    let table = new Table({
      head: [
        'country',
        'product',
        'storeId (buCode)',
        'stock',
        'probability',
      ],
      colAligns: [
        null,
        null,
        'right',
        'right',
        'right',
      ],
    });

    data.results.forEach(function(item) {
      table.push([
        data.countryCode,
        data.productId,
        item.buCode,
        (function(item) {
          let availability = item.stock.availableStock;
          if (availability >= 5) {
            availability = chalk.green(availability);
          } else if (availability >= 1) {
            availability = chalk.yellow(availability);
          } else {
            availability = chalk.red(availability);
          }
          return availability;
        })(item),
        (function(item) {
          let propability = item.stock.inStockProbabilityCode;
          switch (propability) {
            case 'HIGH':
              return chalk.green(propability);
            case 'MEDIUM':
              return chalk.yellow(propability);
            case 'LOW':
              return chalk.red(propability);
            default:
              return propability;
          }
        })(item),
      ]);
    });

    return table.toString();
  },
};
