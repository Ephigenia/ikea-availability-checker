import { AssertionError } from 'assert';
import { expect } from 'chai';
import sinon from 'sinon';

import IOWS2 from './lib/iows2.js';
import checker from './index.js';

describe('index', () => {
  describe('availability', () => {
    it('throws an error when no store was found', async () => {
      return checker.availability('12871', '123456')
        .then(() => { throw new Error('should not run') })
        .catch(err => {
          expect(err).to.be.instanceOf(AssertionError);
          expect(err.message).to.contain('buCode');
        })
    });
    it('resolves to resolved values from getSt availability object', () => {
      const stub = sinon.stub(IOWS2.prototype, 'getStoreProductAvailability').callsFake(() => ({ok: true}));
      return checker.availability('224', 'S69022537')
        .then(() => {
          sinon.assert.calledOnce(stub)
          stub.restore();
        });
    });
  }); // availability

  describe('stores', () => {
    it('exposes all methods from the stores', () => {
      expect(checker.stores).to.have.property('findByCountryCode');
      expect(checker.stores).to.have.property('findById');
      expect(checker.stores).to.have.property('findByQuery');
      expect(checker.stores).to.have.property('findOneById');
      expect(checker.stores).to.have.property('getCountryCodes');
      expect(checker.stores).to.have.property('getLanguageCode');
    });
  }); // stores
}); // suite
