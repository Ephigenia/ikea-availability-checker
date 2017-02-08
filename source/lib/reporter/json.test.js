'use strict';

const expect = require('chai').expect;
const reporter = require('./json');

let resultFixture = [
  {
    buCode: 123,
    stock: {
      availableStock: {
        availability: 999,
        inStockProbabilityCode: 'HIGH',
      },
    },
  },
];

describe('stock reporter json', function() {
  it('shows the output as plain json object', function() {
    let data = {
      countryCode: 'de',
      productId: 'S49903093',
      results: resultFixture,
    };
    let report = reporter.show(data);
    expect(report).to.equal(
      '{"countryCode":"de","productId":"S49903093","results":[' +
      '{"buCode":123,"stock":{"availableStock":{"availability":999,' +
      '"inStockProbabilityCode":"HIGH"}}}]}'
    );
  });
});
