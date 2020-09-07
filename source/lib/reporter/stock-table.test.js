'use strict';

const expect = require('chai').expect;
const reporter = require('./stock-table');

describe('stock reporter table', function() {
  function exampleData() {
    return [
      {
        store: {
          buCode: '094',
          name: 'Taastrup',
          countryCode: 'de'
        },
        productId: 'S49903093',
        availability: {
          createdAt: new Date('2020-01-01'),
          stock: 999,
          probability: 'HIGH',
          restockDate: new Date('2020-01-03'),
          forecast: [
            {
              date: new Date('2020-01-04'),
              stock: 100,
              probability: 'MEDIUM',
            }
          ]
        },
      }
    ];
  }

  it('can render the results without forecast', () => {
    const data = exampleData();
    delete data[0].availability.forecast;
    let lines = reporter.createReport(data);
    expect(lines.length).to.be.gte(2);
  });
  it('can render the results without restockDate', () => {
    const data = exampleData();
    delete data[0].availability.restockDate;
    let lines = reporter.createReport(data);
    expect(lines.length).to.be.gte(2);
  });
  it('translates the countrycode to the country’s name', function() {
    const data = exampleData();
    let lines = reporter.createReport(data).split(/\n/);
    expect(lines[lines.length - 2]).to.match(/Germany/);
  });
  it('contains the products, countryname, stock amount', function() {
    const data = exampleData();
    let lines = reporter.createReport(data).split(/\n/);
    expect(lines[lines.length - 2]).to.match(/S49903093/);
    expect(lines[lines.length - 2]).to.match(/de/);
    expect(lines[lines.length - 2]).to.match(/999/);
    expect(lines[lines.length - 2]).to.match(/094/);
    expect(lines[lines.length - 2]).to.match(/Taastrup/);
  });
  it('contains restockDate & forecast data', function() {
    const data = exampleData();
    let lines = reporter.createReport(data).split(/\n/);
    expect(lines[lines.length - 2]).to.match(/01-04/);
    expect(lines[lines.length - 2]).to.match(/100/);
  });
});
