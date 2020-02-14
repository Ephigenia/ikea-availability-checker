'use strict';

const expect = require('chai').expect;
const stores = require('./stores');

describe('stores', function() {
  describe('findNameByBuCode', function() {
    it('returns null when buCode was not found', function() {
      expect(stores.findNameByBuCode(9283)).to.be.null;
    });
    it('returns the name of the store', function() {
      expect(stores.findNameByBuCode(387)).to.equal('Graz');
    });
  }); // findNameByBuCode

  describe('findByCountryCode', () => {
    it('returns a list of stores for a single country code', () => {
      expect(stores.findByCountryCode('de').length).to.be.gte(1);
    });
    it('normalizes and trims the country code', () => {
      expect(stores.findByCountryCode(' De').length).to.be.gte(1);
    });
    it('returns an empty array if nothing was found', () => {
      expect(stores.findByCountryCode('xx')).to.have.length(0);
    });
  }); // findByCountryCode

  describe('getStoresMatchingQuery', () => {
    it('returns nothing if no stores are found', () => {
      expect(stores.getStoresMatchingQuery('xxxx')).to.have.length(0);
    });
    it('ignores the country code if not given', () => {
      expect(stores.getStoresMatchingQuery('berlin')).to.have.length(4);
      expect(stores.getStoresMatchingQuery('graz')).to.have.length(1);
    });
    it('returns only stores from the country', () => {
      expect(stores.getStoresMatchingQuery('berlin', 'de')).to.have.length(4);
      expect(stores.getStoresMatchingQuery('graz', 'de')).to.have.length(0);
      expect(stores.getStoresMatchingQuery('graz', 'at')).to.have.length(1);
    });
  }); // getStoresMatchingQuery

  describe('getStoresById', () => {
    it('returns an empty list when no stores found', () => {
      expect(stores.getStoresById([1,2,3,4])).to.have.length(0);
    });
    it('returns an empty list when no stores found', () => {
      expect(stores.getStoresById(['421', '394'])).to.have.length(2);
    });
    it('returns an empty list when no stores found', () => {
      expect(stores.getStoresById(['421', 18282])).to.have.length(1);
    });
  });

  describe('getLanguageCode', function() {
    it('returns the countryCode when it’s not in the mapping', () => {
      expect(stores.getLanguageCode('de')).to.equal('de');
    });
    it('returns "de" for "at"', () => {
      expect(stores.getLanguageCode('at')).to.equal('de');
    });
    it('returns "en" for "lio"', () => {
      expect(stores.getLanguageCode('lio')).to.equal('en');
    });
    it('returns "ko" for "kr"', () => {
      expect(stores.getLanguageCode('kr')).to.equal('ko');
    });
  }); // getLanguageCode
}); // suite
