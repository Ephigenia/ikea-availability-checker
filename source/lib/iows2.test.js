'use strict';

const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const nock = require('nock');
const fixturesDir = path.join(__dirname, '..', 'test', 'fixtures');

const { AssertionError } = require('assert');

describe('IOWS2', () => {
  const IOWS2 = require('./iows2');
  const errors = require('./iows2Errors');

  describe('constructor', () => {
    it('throws an error when countryCode is invalid', () => {
      expect(() => { new IOWS2(); }).to.throw(Error);
      expect(() => { new IOWS2(false); }).to.throw(Error);
      expect(() => { new IOWS2(123); }).to.throw(Error);
    });
    it('throws an error when languageCode is invalid', () => {
      expect(() => { new IOWS2('de', {}); }).to.throw(Error);
      expect(() => { new IOWS2('de', 123); }).to.throw(Error);
    });
    it('normalizes the countryCode', () => {
      const instance = new IOWS2('   DE ');
      expect(instance.countryCode).to.equal('de');
    });
    it('normalizes the languageCOde', () => {
      const instance = new IOWS2('de', '   DE ');
      expect(instance.languageCode).to.equal('de');
    });
    it('detects the languageCode for the country', () => {
      const instance = new IOWS2('gb');
      expect(instance.languageCode).to.equal('en');
    });
  }); // constructor

  describe('buildUrl', () => {
    const iows = new IOWS2('de');
    it('returns a valid iows availability url including all components', () => {
      expect(
        iows.buildUrl('base', 'de', 'de', '827', 'S19283', 'ART')
      ).to.equal('base/de/de/stores/827/availability/ART/S19283');
    });
    it('uses ART as default productType', () => {
      expect(
        iows.buildUrl('base', 'de', 'de', '827', 'S19283')
      ).to.equal('base/de/de/stores/827/availability/ART/S19283');
    });
  }); // buildUrl

  describe('normalizeProductId', () => {
    const tests = [
      ['70078465', '70078465'],
      ['700.784.63', '70078463'],
      ['700.784.63 .', '70078463'],
      ['.700.784.63 . ', '70078463'],
      [' 7291.8127.12', '7291812712'],
      ['S7291812712', 'S7291812712'],
      [false, ''],
      [null, ''],
      [undefined, ''],
    ];
    tests.forEach(function(test) {
      it(`normalizes ${JSON.stringify(test[0])} to ${JSON.stringify(test[1])}`, function() {
        const iows = new IOWS2('de');
        expect(iows.normalizeProductId(test[0])).to.equal(test[1]);
      });
    });
  }); // normalizeProductId

  describe('normalizeBuCode', () => {
    const tests = [
      ['123', '123'],
      [' 123 ', '123'],
      ['001', '001'],
      ['A912X.', '912'],
      [false, ''],
      [null, ''],
      [undefined, ''],
    ];
    tests.forEach(function(test) {
      it(`normalizes ${JSON.stringify(test[0])} to ${JSON.stringify(test[1])}`, function() {
        const iows = new IOWS2('de');
        expect(iows.normalizeBuCode(test[0])).to.equal(test[1]);
      });
    });
  });

  describe('getStoreProductAvailability', () => {
    const iows = new IOWS2('de');
    afterEach(() => nock.cleanAll());
    const bodyData = fs.readFileSync(path.join(fixturesDir, 'iows-response-product1.json'));

    describe('argument validation', () => {
      [null, undefined, 123, {}].forEach(buCode => {
        it(`throws an error when buCode is ${JSON.stringify(buCode)}`, async () => {
          return iows.getStoreProductAvailability(buCode)
            .then(() => { throw new Error('should not run') })
            .catch(err => {
              expect(err).to.be.instanceOf(AssertionError);
              expect(err.message).to.contain('ea6471f8');
            })
        });
      });

      [null, undefined, {}].forEach(productId => {
        it(`throws an error when productId is ${JSON.stringify(productId)}`, async () => {
          return iows.getStoreProductAvailability('123', productId)
            .then(() => { throw new Error('should not run') })
            .catch(err => {
              expect(err).to.be.instanceOf(AssertionError);
              expect(err.message).to.contain('5492aeea');
            })
        });
      });

      ['false', 'undefined', '{}'].forEach(productId => {
        it(`throws an error when productId is ${JSON.stringify(productId)}`, async () => {
          return iows.getStoreProductAvailability('123', productId)
            .then(() => { throw new Error('should not run') })
            .catch(err => {
              expect(err).to.be.instanceOf(AssertionError);
              expect(err.message).to.contain('06a5d687');
            })
        });
      });

      ['false', 'undefined', '{}'].forEach(buCode => {
        it(`throws an error when buCode is ${JSON.stringify(buCode)}`, async () => {
          return iows.getStoreProductAvailability(buCode, '123')
            .then(() => { throw new Error('should not run') })
            .catch(err => {
              expect(err).to.be.instanceOf(AssertionError);
              expect(err.message).to.contain('b92bb3e4');
            })
        });
      });
    }); // argument validation

    describe('successfull', () => {
      it('returns the availability details for the product', () => {
        const scope = nock(iows.baseUrl).get(/.*/).reply(200, bodyData);
        return iows.getStoreProductAvailability('123', '999')
          .then(availabilityData => {
            // general availability details
            expect(availabilityData).to.deep.include({
              buCode: '123',
              productId: '999',
              stock: 0,
              probability: 'LOW',
            });
            expect(availabilityData.createdAt).to.be.instanceOf(Date);
            expect(availabilityData.restockDate).to.be.instanceOf(Date);
            // validate forecast data
            expect(availabilityData.forecast.length).to.be.greaterThanOrEqual(1);
            availabilityData.forecast.forEach(forecast => {
              expect(forecast).to.have.property('stock', 0)
              expect(forecast).to.have.property('probability', 'LOW');
              expect(forecast).to.have.property('date').to.be.an.instanceOf(Date);
            })
            scope.isDone();
          });
      });
    });

    it('accept product code in dot notation', () => {
      const scope = nock(iows.baseUrl)
      .get((uri) => {
        expect(uri).to.match(/\/999$/);
        return true;
      })
      .reply(200, bodyData);
      return iows.getStoreProductAvailability('123', '9.9.9')
        .then(() => scope.isDone());
    });

    it('detects the productType form the productCode when it starts with an "s"', () => {
      const scope = nock(iows.baseUrl)
        .get((uri) => {
          expect(uri).to.match(/SPR\/12817$/);
          return true;
        })
        .reply(200, bodyData);
      return iows.getStoreProductAvailability('123', 'S12817')
        .then(() => scope.isDone());
    });
    it('throws an error on invalid http response codes', () => {
      const scope = nock(iows.baseUrl).get(/.*/).reply(401, '{"success": true}');
      return iows.getStoreProductAvailability('123', '999')
        .then(() => { throw Error('Unexpected promise resolved' )})
        .catch(err => {
          scope.isDone();
          expect(err).to.be.instanceof(errors.IOWS2ResponseError);
          expect(err.message).to.match(/Unable to receive product 999/i);
          expect(err).to.have.property('response');
          expect(err).to.have.property('request');
        });
    });
    it('throws an error when the response data could not be parsed', () => {
      const scope = nock(iows.baseUrl).get(/.*/).reply(200, '{"success": true}');
      return iows.getStoreProductAvailability('123', '999')
        .then(() => { throw Error('Unexpected promise resolved' )})
        .catch(err => {
          scope.isDone();
          expect(err).to.be.instanceof(errors.IOWS2ParseError);
          expect(err.message).to.match(/unable to parse valid looking response/i);
          expect(err).to.have.property('data');
        });
    });
  }); // getStoreProductAvailability

  describe('fetch', () => {
    const URL = 'http://localhost';
    const iows = new IOWS2('de');
    afterEach(() => nock.cleanAll());

    it('throws an error on invalid status codes response', () => {
      const scope = nock(URL).get(/.+/).reply(404, '');
      return iows.fetch(URL, {})
        .then(() => {throw Error('Unexpected resolved promise')})
        .catch(err => {
          scope.isDone();
          expect(err).to.be.an.instanceOf(errors.IOWS2ResponseError);
          expect(err.message).to.match(/Request failed/);
          expect(err).to.have.property('request');
          expect(err).to.have.property('response');
        });
    });
    it('throws an error when the response doesn’t contain valid json', () => {
      const scope = nock(URL).get(/.+/).reply(200, '<html>');
      return iows.fetch(URL, {})
        .catch(err => {
          expect(err).to.be.instanceOf(errors.IOWS2ParseError);
          expect(err).to.have.property('message').to.match(/Unable to parse/i);
          scope.isDone();
        });
    });

    it('throws a IOWS2Deprecated error when the api returns a deprecation warning', () => {
      const scope = nock(URL).get(/.+/)
        .reply(404, 'Gone', {
          'deprecation': 'version="1", date="Sat, 31 Dec 2022 23:59:59 GMT"',
          'warning': 'IOWSStockAvailabilityService.GetStockAvailability.v1 API is now deprecated.',
          'link': 'alternate="Customer Item Availability. Enquire via slack #rrm-cia"',
          'x-global-transaction-id': 'a345495061bc8d13018340e5',
        });
      return iows.fetch(URL, {})
        .then(() => {throw Error('Unexpected resolved promise')})
        .catch(err => {
          expect(err).to.be.instanceof(errors.IOWS2DeprecatedError);
          scope.isDone();
        });
    });

    it('sends the correct header and request data', () => {
      const scope = nock(URL, {
        reqheaders: {
          Accept: 'application/vnd.ikea.iows+json;version=1.0',
          Contract: '37249',
          Consumer: 'MAMMUT',
        }
      }).get(/.+/).reply(200, '{}');
      return iows.fetch(URL, {}).then(() => scope.isDone());
    });

    it('returns the response’s body data', () => {
      const scope = nock(URL)
        .get(/.+/)
        .reply(200, '{"success": true}');
      return iows.fetch(URL, {})
        .then((data) => {
          expect(data).to.deep.equal({ success: true });
          scope.isDone();
        });
    });
  }); // fetch
}); // suite
