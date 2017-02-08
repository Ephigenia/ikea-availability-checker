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
});
