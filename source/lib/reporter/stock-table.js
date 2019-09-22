'use strict';

let Table = require('cli-table');
let chalk = require('chalk');
let countries = require('i18n-iso-countries');

function availabilityColor(val) {
  if (val >= 5) {
    return chalk.green;
  } else if (val >= 1) {
    return chalk.yellow;
  } else {
    return chalk.red;
  }
}

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

module.exports = {
  createReport: function(data) {
    let table = new Table({
      head: [
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
        'right',
        'right',
      ],
    });

    data
      .map(({ productId, store, availability }) => [
        store.countryCode,
        countries.getName(store.countryCode, 'en'),
        productId,
        store.buCode,
        store.name,
        availabilityColor(availability.stock)(availability.stock),
        probabilityColor(availability.probability)(availability.probability),
      ])
      .forEach(row => table.push(row));

    return table.toString();
  },
};
