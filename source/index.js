import assert from 'node:assert';

import IOWS2 from './lib/iows2.js';
import stores from './lib/stores.js';
import * as errors from './lib/iows2Errors.js';

export default {
  /**
   * Asynchronously requests the availability of a specific product in one
   * specific store and returns an object with the information.
   *
   * @example
   * // request the stock info for "Billy (white)" from Braunschweig germany
   * const stockInfo = await checker.availability('117', '00263850')
   *
   * @param {string} buCode ikea store identification number
   * @param {string} productId ikea product identification number
   * @param {import('axios').AxiosRequestConfig} [options] axios requrest options
   * @throws AssertionError when the store wasn’t found
   * @returns {Promise<import('./lib/iows2').ProductAvailability>}
   *   resulting product availability
   */
  availability: async (buCode, productId, options) => {
    const store = stores.findOneById(buCode);
    assert.ok(store, `Unable to find a store with the given buCode: ${buCode}.`);
    const iows = new IOWS2(store.countryCode, undefined, options);
    return iows.getStoreProductAvailability(buCode, productId)
  },
  stores,
  errors,
};
