'use strict';

const csvString = require('csv-string');
let countries = require('i18n-iso-countries');

module.exports = {
  createReport: function(data) {
    const str = data
      .map(({ productId, store, availability }) => {
        return [
          availability.createdAt.toISOString(),
          productId,
          store.countryCode,
          countries.getName(store.countryCode, 'en'),
          store.buCode,
          store.name,
          availability.stock,
          availability.probability
        ]
      })
      .map(row => csvString.stringify(row))
      .join('');
    return str;
  },
};
