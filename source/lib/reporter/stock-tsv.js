'use strict';

let countries = require('i18n-iso-countries');

module.exports = {
  createReport: function(data) {
    return data
      .map(({ productId, store, availability }) => [
        availability.createdAt.toISOString(),
        productId,
        store.countryCode,
        countries.getName(store.countryCode, 'en'),
        store.buCode,
        store.name,
        availability.stock,
        availability.probability
      ].join('\t'))
      .join('\n');
  },
};
