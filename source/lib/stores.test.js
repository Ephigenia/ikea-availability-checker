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
  });
});
