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
    case 'HIGH':
      return chalk.green;
    case 'MEDIUM':
      return chalk.yellow;
    case 'LOW':
      return chalk.red;
    default:
      return (v) => v;
  }
}

function diffDays(date1, date2) {
  return (date1.getTime() - date2.getTime()) / 60 / 60 / 24 / 1000;
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
        'forecast',
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
        null,
      ],
    });

    data
      .map(({ productId, store, availability }) => {
        const { restockDate, createdAt, stock, probability } = availability;

        let restockColumn = '';
        if (availability.restockDate) {
          const daysUntilRestock = Math.floor(diffDays(availability.restockDate, new Date()));
          if (daysUntilRestock > 0) {
            restockColumn = `in ${daysUntilRestock}d (${restockDate.toISOString().substr(0, 10)})`;
          }
        }

        const forecast = (availability.forecast || []).map(item => {
          const shortDate = item.date.toISOString().substr(5, 5);
          const coloredStock = availabilityColor(item.stock)(item.stock);
          return `${shortDate}: ${coloredStock}`;
        }).join(', ');

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
          forecast,
        ]
      })
      .forEach(row => table.push(row));

    return table.toString();
  },
};
