'use strict';

const expect = require('chai').expect;
const Scraper = require('./scraper');

describe('Scraper', () => {

  describe('get', () => {
    it('rejects the promise with an error when the url isn’t a string', () => {
      const scraper = new Scraper('de', 'de');
      return scraper.get(false).catch(err => {
        expect(err).to.be.an.instanceOf(TypeError)
      });
    });
  }); // get

  describe('parseProductCollections', () => {
    it('rejects the promise with an error when the body isn’t a string', () => {
      const scraper = new Scraper('de', 'de');
      return scraper.parseProductCollections(172).catch(err => {
        expect(err).to.be.an.instanceOf(TypeError)
      });
    });
  }); // get

  describe('getProductCollections', () => {
    it('rejects the promise with an error when the letterCode isn’t a number', () => {
      const scraper = new Scraper('de', 'de');
      return scraper.getProductCollections('Asas').catch(err => {
        expect(err).to.be.an.instanceOf(TypeError)
      });
    });
    it('rejects the promise with an error when the letterCode is negative', () => {
      const scraper = new Scraper('de', 'de');
      return scraper.getProductCollections(-1).catch(err => {
        expect(err).to.be.an.instanceOf(Error)
      });
    });
  }); // get

  describe('parseProducts', () => {
    it('rejects the promise with an error when the url isn’t a string', () => {
      const scraper = new Scraper('de', 'de');
      return scraper.parseProducts(131).catch(err => {
        expect(err).to.be.an.instanceOf(TypeError)
      });
    });
  });

  describe('getProductsFromCollectionUrl', () => {
    it('rejects the promise with an error when the url isn’t a string', () => {
      const scraper = new Scraper('de', 'de');
      return scraper.getProductsFromCollectionUrl(131).catch(err => {
        expect(err).to.be.an.instanceOf(TypeError)
      });
    });
  });

});
