'use strict';

const expect = require('chai').expect;
const reporter = require('./stock-json');

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
  it('shows the output as plain json object with 2-spaces indention', function() {
    let data = {
      countryCode: 'de',
      productId: 'S49903093',
      results: resultFixture,
    };
    let report = reporter.createReport(data);
    expect(report).to.equal(`{
  "countryCode": "de",
  "productId": "S49903093",
  "results": [
    {
      "buCode": 123,
      "stock": {
        "availableStock": {
          "availability": 999,
          "inStockProbabilityCode": "HIGH"
        }
      }
    }
  ]
}`);
  });
});
