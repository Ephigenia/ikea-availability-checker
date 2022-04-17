'use strict';

const axios = require('axios');
const stores = require('./stores');
const helper = require('./helper');
const errors = require('./ingkaErrors');

/**
 * @typedef {object} IngkaProductAvailability
 * @property {string} buCode
 * @property {Date} createdAt instance of a javascript date of the moment when
 *   the data was created.
 * @property {ProductAvailabilityProbability} probability
 *   probability of the product beeing in store ("LOW_IN_STOCK", "HIGH_IN_STOCK" or "OUT_OF_STOCK")
 * @property {string} productId
 *   ikea product identification number
 * @property {import('./stores').Store} store
 * @property {number} stock
 *   number of items currently in stock
 */

// clientids taken from IKEA.tld websites
// they may change in the future
const CLIENT_ID_US = 'da465052-7912-43b2-82fa-9dc39cdccef8';
// const CLIENT_ID_IT = 'b6c117e5-ae61-4ef5-b4cc-e0b1e37f0631';
// const CLIENT_ID_BE = 'b6c117e5-ae61-4ef5-b4cc-e0b1e37f0631';
// const CLIENT_ID_NL = 'ac8b6bc1-b924-4bba-ba90-251610525145';

const cache = {};

class IngkaApi {
  constructor(
    clientId = CLIENT_ID_US, // us code
    options = {},
  ) {
    this.client = axios.create({
      timeout: 5000,
      baseURL: 'https://api.ingka.ikea.com',
      headers: {
        'x-client-id': clientId || CLIENT_ID_US,
      },
      ...options,
    });
  }

  parseAvailabilitiesResponse(data) {
    return data.data
      // the ingka API response contains 2-3 items which don’t belong to a
      // specific store and can be filtered out
      .filter(item =>
        item.classUnitKey &&
        item.classUnitKey.classUnitType &&
        item.classUnitKey.classUnitType === 'STO'
      )
      .filter(item =>
        item.availableStocks &&
        item.availableStocks.length > 0
      )
      .map(item => {
        const ret = {
          createdAt: null,
          probability: null,
          buCode: item.classUnitKey.classUnitCode,
          productId: item.itemKey.itemNo,
          stock: 0,
          store: stores.findOneById(item.classUnitKey.classUnitCode)
        };

        const cashNCarry = (item.availableStocks || [])
          .find(item => item.type === 'CASHCARRY');
        if (cashNCarry) {
          ret.stock = parseInt(cashNCarry.quantity, 10);
          ret.createdAt = new Date(cashNCarry.updateDateTime);

          const probability = (cashNCarry.probabilities || []).find(item => (
            item.communication && item.communication.messageType
          ));
          if (probability) {
            ret.probability = probability.communication.messageType;
          }
        }

        return ret;
      });
  }

  // TODO add the ability to pass over arrays for buCode and itemCode
  async getStoreProductAvailability(buCode, itemCode) {
    buCode = helper.normalizeBuCode(buCode);
    const store = stores.findOneById(buCode);

    const key = store.countryCode + itemCode;
    if (!cache[key]) {
      cache[key] = await this.getAvailabilities(store.countryCode, itemCode);
    }

    return cache[key].find(item => item.store.buCode === buCode);
  }

  /**
   * @param {string} countryCode a single supported country code
   * @param {string[]} itemNos one or multiple ikea article ids
   * @param {string[]} expand value of expand parameter
   * @returns {import('axios').AxiosResponse}
   */
  async getAvailabilities(countryCode, itemNos, expand = ['StoresList', 'Restocks']) {
    const uri = `cia/availabilities/ru/${countryCode}`;

    const params = {
      // StoresList,Restocks,SalesLocations
      expand: (expand || ['StoresList', 'Restocks']).join(','),
      itemNos: (Array.isArray(itemNos) ? itemNos : [itemNos])
        .map(helper.normalizeProductId)
        .join(','),
    };

    let response;
    try {
      response = await this.client.get(uri, { params })
    } catch (err) {
      if (err.response && err.response.status === 404) {
        throw new errors.IngkaNotFoundError(err);
      }
      throw new errors.IngkaResponseError(err);
    }

    // Ingka api replies with status 200 on invalid product codes
    if (response.data && response.data.errors) {
      if (response.data.errors[0].code === 404) {
        throw new errors.IngkaNotFoundError(response);
      }
      throw new errors.IngkaResponseError(response);
    }
    return this.parseAvailabilitiesResponse(response.data);
  }
}

module.exports = IngkaApi;
