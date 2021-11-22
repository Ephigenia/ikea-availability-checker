import { expect } from 'chai';
import stores from './stores.js';

describe('stores', function() {
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

  describe('findByQuery', () => {
    it('returns nothing if no stores are found', () => {
      expect(stores.findByQuery('xxxx')).to.have.length(0);
    });
    it('returns stores where buCode matches', () => {
      expect(stores.findByQuery('039')).to.have.length(1);
    });
    it('returns stores where buCode and country matches', () => {
      expect(stores.findByQuery('039', 'ca')).to.have.length(1);
      expect(stores.findByQuery('039', 'de')).to.have.length(0);
    });
    it('accepts RegExps', () => {
      expect(stores.findByQuery(/berlin|graz|bristol/i)).to.have.length(6);
    });
    it('ignores the country code if not given', () => {
      expect(stores.findByQuery('berlin')).to.have.length(4);
      expect(stores.findByQuery('graz')).to.have.length(1);
    });
    it('returns only stores from the country', () => {
      expect(stores.findByQuery('berlin', 'de')).to.have.length(4);
      expect(stores.findByQuery('graz', 'de')).to.have.length(0);
      expect(stores.findByQuery('graz', 'at')).to.have.length(1);
      expect(stores.findByQuery('graz', 'AT')).to.have.length(1);
    });
  }); // findByQuery

  describe('findById', () => {
    it('accepts single string ids and returns the matching store', () => {
      expect(stores.findById('129')).to.have.length(1);
    });
    it('accepts single numeric ids and returns the matching store', () => {
      expect(stores.findById('129')).to.have.length(1);
    });
    it('returns an empty list when no stores found', () => {
      expect(stores.findById([1,2,3,4])).to.have.length(0);
    });
    it('returns an empty list when no stores found', () => {
      expect(stores.findById(['421', '394'])).to.have.length(2);
      expect(stores.findById([421, 394])).to.have.length(2);
    });
    it('returns an empty list when no stores found', () => {
      expect(stores.findById(['421', 18282])).to.have.length(1);
    });
  }); // findById

  describe('findOneById', () => {
    it('returns undefined when no store with id found', () => {
      expect(stores.findOneById('1282')).to.equal(undefined);
    });
    it('returns the matching store', () => {
      const store = stores.findOneById('039');
      expect(store).to.have.property('name');
      expect(store.name).to.equal('Montreal');
    });
    it('returns the matching store when number is given', () => {
      const store = stores.findOneById(139);
      expect(store).to.have.property('name');
      expect(store.name).to.equal('Halle/Leipzig')
      expect(stores.findOneById('139')).to.deep.equal(store);
    });
  });

  describe('getLanguageCode', function() {
    it('returns the countryCode when it’s not in the mapping', () => {
      expect(stores.getLanguageCode('de')).to.equal('de');
    });
    it('returns "de" for "at"', () => {
      expect(stores.getLanguageCode('at')).to.equal('de');
    });
    it('returns "ko" for "kr"', () => {
      expect(stores.getLanguageCode('kr')).to.equal('ko');
    });
  }); // getLanguageCode

  describe('getCountryCodes', function() {
    it('returns an array of supported country codes', () => {
      const codes = stores.getCountryCodes();
      expect(codes.length).to.be.gte(1);
    });
  }); // getCountryCodes
}); // suite
