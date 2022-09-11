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
      ],
      colAligns: [
        null,
        null,
        null,
        null,
        null,
        null,
        'right',
      ],
    });

    data
      .map(({ productId, store, availability }) => {
        const { createdAt, stock, probability } = availability;

        return [
          createdAt.toISOString(),
          store.countryCode,
          countries.getName(store.countryCode, 'en'),
          productId,
          store.buCode,
          store.name,
          availabilityColor(stock)(stock),
          probabilityColor(probability)(probability),
        ]
      })
      .forEach(row => table.push(row));

    return table.toString();
  },
};
