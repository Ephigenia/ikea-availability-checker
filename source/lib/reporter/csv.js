'use strict';

const csvString = require('csv-string');

module.exports = {
  show: function(results) {
    return csvString.stringify(results);
  },
};
