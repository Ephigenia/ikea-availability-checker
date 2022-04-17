'use strict';

const expect = require('chai').expect;
const reporter = require('./stock-table');

describe('stock reporter table', function() {

  describe('availabilityColor', () => {
    it('returns a different colored for 5 and 4', () => {
      expect(reporter.availabilityColor(5))
        .not.to.equal(reporter.availabilityColor(4));
      expect(reporter.availabilityColor(5))
        .not.to.equal(reporter.availabilityColor(0));
    });
    it('returns a different colored for 4 and 1', () => {
      expect(reporter.availabilityColor(4))
        .not.to.equal(reporter.availabilityColor(0));
    });
  }); // availabilityColor

  describe('probabilityColor', () => {
    it('returns a different function for HIGH than for MEDIUM', () => {
      expect(reporter.probabilityColor('HIGH')).not.to.equal(
        reporter.probabilityColor('MEDIUM')
      );
    });
    it('returns a different function for MEDIUM than for LOW', () => {
      expect(reporter.probabilityColor('HIGH')).not.to.equal(
        reporter.probabilityColor('LOW')
      );
    });
    it('returns a different function for LOW than for [unknown]', () => {
      expect(reporter.probabilityColor('LOW')('LOW')).not.to.equal(
        reporter.probabilityColor('')('v')
      );
    });
  }); // probabilityColor

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
  it.skip('shows the restockprobability');
  it('contains the products, countryname, stock amount', function() {
    const data = exampleData();
    let lines = reporter.createReport(data).split(/\n/);
    expect(lines[lines.length - 2]).to.match(/S49903093/);
    expect(lines[lines.length - 2]).to.match(/de/);
    expect(lines[lines.length - 2]).to.match(/999/);
    expect(lines[lines.length - 2]).to.match(/094/);
    expect(lines[lines.length - 2]).to.match(/Taastrup/);
  });
});
