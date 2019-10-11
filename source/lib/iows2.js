'use strict';

const debug = require('debug')('iows');
const request = require('request');
const util = require('util');
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
    const p = util.promisify(request);
    return p(url, params)
      .then((response) => {
        debug('RECEIVED', response.statusCode, response.body.length);
        if (response.statusCode !== 200) {
          const err = new Error(`Unexpected http status code ${response.statusCode}`);
          err.response = response;
          throw err;
        }
        return JSON.parse(response.body);
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
    const url = [
      this.baseUrl,
      encodeURIComponent(this.countryCode),
      encodeURIComponent(this.languageCode),
      'stores',
      buCode,
      'availability/ART',
      encodeURIComponent(productId)
    ].join('/');
    return this.fetch(url)
      .catch(err => {
        switch (err.response.statusCode) {
          case 410:
          case 404:
            err.message =
              `Unable to receive product ${productId} availability for store `+
              `${buCode} status code: ${err.response.statusCode}.`
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
