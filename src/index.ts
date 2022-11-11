import { AxiosRequestConfig } from "axios";
import { IngkaApi, ItemStockInfo } from "./lib/ingka";
import { findById, findOneById, Store } from "./lib/stores";

const assert = require('assert');

// const IngkaApi = require('./lib/ingka');
// const stores = require('./lib/stores');
// const errors = require('./lib/ingkaErrors');

// module.exports = {

//    * @param {string}
//    * @param {string} productId
//    * @param {import('axios').AxiosRequestConfig} [options] axios requrest options
//    * @throws AssertionError when the store wasn’t found
//    * @returns {Promise<import('./lib/ingka').IngkaProductAvailability>}
//    *   resulting product availability
//    */
//   availability: async (buCode, productId, options) => {
//     const store = stores.findOneById(buCode);
//     assert.ok(store, `Unable to find a store with the given buCode: ${buCode}.`);
//     const client = new IngkaApi(undefined, options);
//     return client.getStoreProductAvailability(buCode, productId);
//   },
//   // stores,
//   // errors,
// };

/**
 * Asynchronously requests the availability of a specific product in one
 * specific store and returns an object with the information.
 *
 * @example
 * // request the stock info for "Billy (white)" from Braunschweig germany
 * const stockInfo = await checker.availability('117', '00263850')
 */
export async function availability (
  /** buCode ikea store identification number */
  buCode: string,
  /** ikea product identification number */
  productId: string,
  /** axios requrest options */
  options: AxiosRequestConfig = {}
): Promise<ItemStockInfo> {
  const store = findOneById(buCode);
  if (!store) {
    throw new Error(`Unable to find a store with the given buCode: ${buCode}.`);
  }
  const iows = new IngkaApi(undefined, options);
  return iows.getStoreProductAvailability(store.countryCode, productId, buCode);
}

export async function availabilities(
  stores: Store[],
  productIds: string[],
  options: AxiosRequestConfig = {},
) {
  const storesProductMap = productIds.map(productId => {
    return stores.map(store => ({ productId, store }));
  });
  const iows = new IngkaApi(undefined, options);
  const promises = storesProductMap.flat().map(({ store, productId }) => {
    return iows.getStoreProductAvailability(store.countryCode, productId, store.buCode);
  });

  return Promise.all(promises);
}
