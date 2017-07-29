'use strict';

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
    }); // url

    describe('availability', function() {
      describe('failed', function() {
        it('calls the done callback with an error', function(done) {
          let product = iows.country('xx').product('40299687');
          product.availability(function(err, results) {
            expect(err.response.statusCode).to.equal(404);
            expect(results).to.be.undefined;
            done();
          });
        });
      });
      describe('successfull', function() {
        it('returns an array of product availabilitites', function(done) {
          let product = iows.country('de').product('40299687');
          product.availability(function(err, results) {
            expect(err).to.be.null;
            expect(results).to.be.an('array').to.have.length.of.gte(2);
            done();
          });
        });
      });
    }); // availability
  }); // country product
});
