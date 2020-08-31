'use strict';

const fetch = require('node-fetch');

const pkg = require('./../../package.json')
const debug = require('debug')(pkg.name);
const storesData = require('./stores');

const BASE_URL_DEFAULT = 'https://iows.ikea.com/retail/iows';

/**
 * @typedef {Object} ProductAvailability
 * @property {Date} createdAt - instance of Date when the data was created
 * @property {String} probability - probability of the product beeing
 *   in store, LOW, MEDIUM, HIGH
 * @property {Number} stock - number of items currently in stock
 */

/**
 * @class IOWS2
 */
class IOWS2 {
  /**
   * @param {String} countryCode - required ISO 3166-1 alpha-2 country code
   * @param {String} [languageCode] - optional ISO 3166-1 alpha-2 country code
   */
  constructor(countryCode, languageCode = '') {
    this.countryCode = String(countryCode).toLocaleLowerCase();
    this.languageCode = (languageCode || storesData.getLanguageCode(countryCode)).toLowerCase();
    this.baseUrl = BASE_URL_DEFAULT;
  }

  /**
   *
   * @param {String} url
   * @param {Options<String, any>} params
   * @param {Options<String, any>} params.headers
   * @return {Promise<Object, any>}
   * @throws {Error}
   */
  async fetch(url, params = {}) {
    params.headers = Object.assign({}, params.headers, {
      'Accept': 'application/vnd.ikea.iows+json;version=1.0',
      'Contract': '37249',
      'Consumer': 'MAMMUT',
    });
    debug('GET', url, params);
    return fetch(url, params)
      .then(response => {
        debug('RECEIVED', response.status, response.length);
        if (!response.ok) {
          const err = new Error(`Unexpected http status code ${response.status}`);
          err.response = response;
          throw err;
        }
        return response.json();
      });
  }

  /**
   * @param {Object<String, any>} data
   * @returns {ProductAvailability}
   */
  static parseAvailabilityFromResponseData(data) {
    const stock = data.StockAvailability.RetailItemAvailability.AvailableStock.$;
    const probability = data.StockAvailability.RetailItemAvailability.InStockProbabilityCode.$;
    return {
      createdAt: new Date(),
      probability,
      stock,
    };
  }

  /**
   * @param {String} buCode
   * @param {String} productId
   * @returns {Promise<ProductAvailability>}
   */
  async getStoreProductAvailability(buCode, productId) {
    // build url for single store and product Id
    // ireland requires a different URL
    let code = 'ART';
    // TODO move this to somewhere else
    if (buCode === '038') {
      code = 'SPR';
    }
    const url = [
      this.baseUrl,
      encodeURIComponent(this.countryCode),
      encodeURIComponent(this.languageCode),
      'stores',
      buCode,
      'availability/' + code,
      encodeURIComponent(productId)
    ].join('/');
    return this.fetch(url)
      .catch(err => {
        switch (err.response.status) {
          case 410:
          case 404:
            err.message =
              `Unable to receive product ${productId} availability for store `+
              `${buCode} status code: ${err.response.status}.`
            break;
          default:
            break;
        }
        throw err;
      })
      .then(data => IOWS2.parseAvailabilityFromResponseData(data)
    );
  }

}

module.exports = IOWS2;
