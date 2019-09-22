'use strict';

const debug = require('debug')('iows');
const request = require('request');
const util = require('util');


/**
 * @typedef {Object} ProductAvailability
 * @property {String} probability - probability of the product beeing
 *   in store, LOW, MEDIUM, HIGH
 * @property {Number} stock - number of items currently in stock
 */

class IOWS2 {

  constructor(countryCode, languageCode) {
    this.countryCode = countryCode;
    this.languageCode = languageCode;
    this.baseUrl = 'https://iows.ikea.com/retail/iows';
  }

  async fetch(url, params = {}) {
    params.headers = Object.assign({}, params.headers, {
      'Accept': 'application/vnd.ikea.iows+json;version=1.0',
      'Contract': '37249',
      'Consumer': 'MAMMUT',
    });
    debug('GET', url, params);
    return util.promisify(request)(url, params)
      .then((response) => {
        debug('RECEIVED', response.statusCode, response.body.length);
        if (response.statusCode === 200) {
          return JSON.parse(response.body);
        }
        const err = new Error(
          'Invalid HTTP Status code: ' + response.statusCode + ' received'
        );
        err.response = response;
        throw err;
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
      .then(data => IOWS2.parseAvailabilityFromResponseData(data)
    );
  }

}

module.exports = IOWS2;
