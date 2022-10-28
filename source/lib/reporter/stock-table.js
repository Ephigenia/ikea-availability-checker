'use strict';

let Table = require('cli-table3');
let chalk = require('chalk');
let countries = require('i18n-iso-countries');

/**
 * Returns a function which when applied on a string colors the string in cli
 *
 * @param {number} val
 * @returns {function}
 */
function availabilityColor(val) {
  if (val >= 5) {
    return chalk.green;
  } else if (val >= 1) {
    return chalk.yellow;
  } else {
    return chalk.red;
  }
}

function diffDays(date1, date2) {
  return (date1.getTime() - date2.getTime()) / 60 / 60 / 24 / 1000;
}

/**
 * Returns a function which when applied on a string colors the string in cli
 *
 * @param {import('../iows2').ProductAvailabilityProbability} val probability code
 * @returns {function}
 */
function probabilityColor(val) {
  switch (val) {
    case 'HIGH_IN_STOCK':
      return chalk.green;
    case 'LOW_IN_STOCK':
      return chalk.yellow;
    case 'OUT_IN_STOCK':
        return chalk.yellow;
    default:
      return (v) => v;
  }
}

module.exports = {
  availabilityColor,
  probabilityColor,
  createReport: function(data) {
    let table = new Table({
      head: [
        'date',
        'countryCode',
        'country',
        'product',
        'storeId (buCode)',
        'store',
        'stock',
        'probability',
        'restockDate',
      ],
      colAligns: [
        null,
        null,
        null,
        null,
        null,
        null,
        'right',
        'right',
      ],
    });

    data
      .map(({ productId, store, availability }) => {
        const { restockDate, createdAt, stock, probability } = availability;

        let restockColumn = '';
        if (restockDate) {
          const daysUntilRestock = Math.floor(diffDays(restockDate, new Date()));
          if (daysUntilRestock > 0) {
            restockColumn = `in ${daysUntilRestock}d (${restockDate.toISOString().substr(0, 10)})`;
          }
        }

        return [
          createdAt.toISOString(),
          store.countryCode,
          countries.getName(store.countryCode, 'en'),
          productId,
          store.buCode,
          store.name,
          availabilityColor(stock)(stock),
          probabilityColor(probability)(probability),
          restockColumn,
        ]
      })
      .forEach(row => table.push(row));

    return table.toString();
  },
};
