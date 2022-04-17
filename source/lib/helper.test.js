'use strict';

const expect = require('chai').expect;
const helper = require('./helper');

describe('helper', function() {

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
        expect(helper.normalizeProductId(test[0])).to.equal(test[1]);
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
        expect(helper.normalizeBuCode(test[0])).to.equal(test[1]);
      });
    });
  });
});
