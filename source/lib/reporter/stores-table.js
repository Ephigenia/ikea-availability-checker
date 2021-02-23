'use strict';

let Table = require('cli-table3');
let countries = require('i18n-iso-countries');

module.exports = {
  show: function(stores) {
    let table = new Table({
      head: [
        'countryCode',
        'country',
        'buCode',
        'name',
      ],
    });

    // sort data by countryCode and buCode in ascending order
    stores.sort(function(a, b) {
      if (a.countryCode > b.countryCode) {
        return 1;
      } else if (a.countryCode < b.countryCode) {
        return -1;
      }
      return 0;
    });
    stores.sort(function(a, b) {
      if (a.buCode > b.buCode) {
        return 1;
      } else if (a.buCode < b.buCode) {
        return -1;
      }
      return 0;
    });

    stores.forEach(function(item) {
      table.push([
        item.countryCode,
        countries.getName(item.countryCode, 'en'),
        item.buCode,
        item.name,
      ]);
    });

    return table.toString();
  },
};
