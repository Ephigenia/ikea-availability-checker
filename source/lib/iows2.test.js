'use strict';

'use strict';

const expect = require('chai').expect;
const { AssertionError } = require('assert');

describe('IOWS2', () => {
  const IOWS2 = require('./iows2');

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

  describe('getStoreProductAvailability', () => {
    const iows = new IOWS2('de');
    describe('argument validation', () => {
      [null, undefined, 123, {}].forEach(buCode => {
        it(`throws an error when buCode is ${JSON.stringify(buCode)}`, async () => {
          return iows.getStoreProductAvailability(buCode)
            .then(() => { throw new Error('should not run') })
            .catch(err => {
              expect(err).to.be.instanceOf(AssertionError);
              expect(err.message).to.contain('buCode');
            })
        });
      });

      [null, undefined, 123, {}].forEach(productId => {
        it(`throws an error when productId is ${JSON.stringify(productId)}`, async () => {
          return iows.getStoreProductAvailability('123', productId)
            .then(() => { throw new Error('should not run') })
            .catch(err => {
              expect(err).to.be.instanceOf(AssertionError);
              expect(err.message).to.contain('productId');
            })
        });
      });
    });
  }); // getStoreProductAvailability
}); // suite
