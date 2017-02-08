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
    let lines = reporter.show(data).split(/\n/);
    expect(lines[lines.length - 2]).to.match(/S49903093/);
    expect(lines[lines.length - 2]).to.match(/Germany/);
    expect(lines[lines.length - 2]).to.match(/999/);
    expect(lines[lines.length - 2]).to.match(/123/);
  });
});
