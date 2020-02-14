'use strict';

const expect = require('chai').expect;
const reporter = require('./stock-table');

describe('stock reporter table', function() {
  it('shows the output as a table', function() {
    let data = [
      {
        store: {
          buCode: '094',
          name: 'Taastrup',
          countryCode: 'de'
        },
        productId: 'S49903093',
        availability: {
          createdAt: new Date(),
          stock: 999,
          probability: 'HIGH',
        }
      }
    ];
    let lines = reporter.createReport(data).split(/\n/);
    expect(lines[lines.length - 2]).to.match(/S49903093/);
    expect(lines[lines.length - 2]).to.match(/Germany/);
    expect(lines[lines.length - 2]).to.match(/de/);
    expect(lines[lines.length - 2]).to.match(/999/);
    expect(lines[lines.length - 2]).to.match(/094/);
    expect(lines[lines.length - 2]).to.match(/Taastrup/);
  });
});
