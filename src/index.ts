import { AxiosRequestConfig } from 'axios';
import { IngkaApi, ItemStockInfo } from './lib/ingka';
import { findOneById, Store } from './lib/stores';

export * as errors from './lib/ingkaErrors';
export * as stores from './lib/stores';

//   availability: async (buCode, productId, options) => {
//     const store = stores.findOneById(buCode);
//     const client = new IngkaApi(undefined, options);
//     return client.getStoreProductAvailability(buCode, productId);
//   },
//   // stores,
//   // errors,

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
): Promise<ItemStockInfo|undefined> {
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
): Promise<Array<ItemStockInfo>> {
  const storesProductMap = productIds.map(productId => {
    return stores.map(store => ({ productId, store }));
  });
  const iows = new IngkaApi(undefined, options);
  const promises = storesProductMap.flat().map(({ store, productId }) => {
    return iows.getStoreProductAvailability(store.countryCode, productId, store.buCode);
  });

  const availabilities = await Promise.all(promises);
  return availabilities.filter(a => a) as ItemStockInfo[];
}
