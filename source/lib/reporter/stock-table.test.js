'use strict';

const expect = require('chai').expect;
const reporter = require('./stock-table');

let resultFixture = [
  {
    buCode: 123,
    stock: {
      availableStock: 999,
      inStockProbabilityCode: 'HIGH',
    },
  },
];

describe('stock reporter table', function() {
  it('shows the output as a table', function() {
    let data = {
      countryCode: 'de',
      productId: 'S49903093',
      results: resultFixture,
    };
    reporter.show(data);
  });
});
