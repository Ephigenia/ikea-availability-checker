'use strict';

const IOWS2 = require('./lib/iows2');
const stores = require('./lib/stores');

module.exports = {
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
   * @returns {Promise<import('./lib/iows2').ProductAvailability>}
   *   resulting product availability
   */
  availability: async (buCode, productId) => {
    const store = stores.getStoreById(buCode);
    // @TODO handle error when store could not be found
    const iows = new IOWS2(store.countryCode);
    return iows.getStoreProductAvailability(buCode, productId)
  },
  stores,
};
