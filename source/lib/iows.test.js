const expect = require('chai').expect;

const iows = require('./iows');

describe('iows', function() {
  describe('country.product', function() {
    describe('url', function() {
      it('returns the correct URL', function() {
        let product = iows.country('de').product('40299687');
        expect(product.url()).to.equal(
          'http://www.ikea.com/de/iows/catalog/availability/40299687'
        );
      });
      it('url escapes the country code', function() {
        let product = iows.country('de/de').product('40299687');
        expect(product.url()).to.equal(
          'http://www.ikea.com/de%2Fde/iows/catalog/availability/40299687'
        );
      });
      it('url escapes the product id', function() {
        let product = iows.country('de').product('40299687,123');
        expect(product.url()).to.equal(
          'http://www.ikea.com/de/iows/catalog/availability/40299687%2C123'
        );
      });
    });
  });
});
