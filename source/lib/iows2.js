'use strict';

const fetch = require('node-fetch');
const assert = require('assert');

const pkg = require('./../../package.json')
const debug = require('debug')(pkg.name);
const stores = require('./stores');

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
    assert.strictEqual(typeof countryCode, 'string',
      `Expected first argument countryCode to be a string, instead ${typeof countryCode} given.`
    );
    if (languageCode) {
      assert.strictEqual(typeof languageCode, 'string',
        `Expected second argument languageCode to be a string, instead ${typeof languageCode} given.`
      );
    }
    this.countryCode = String(countryCode).trim().toLocaleLowerCase();
    this.languageCode = (languageCode || stores.getLanguageCode(countryCode)).trim().toLowerCase();
    this.baseUrl = 'https://iows.ikea.com/retail/iows';
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
        debug('RECEIVED', response.status);
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

  buildUrl(baseUrl, countryCode, languageCode, buCode, productId) {
    // build url for single store and product Id
    // ireland requires a different URL
    let code = 'ART';
    // TODO move this to somewhere else
    if (buCode === '038') {
      code = 'SPR';
    }
    return [
      this.baseUrl,
      encodeURIComponent(this.countryCode),
      encodeURIComponent(this.languageCode),
      'stores',
      buCode,
      'availability/' + code,
      encodeURIComponent(productId)
    ].join('/');
  }

  /**
   * @param {String} buCode
   * @param {String} productId
   * @returns {Promise<ProductAvailability>}
   */
  async getStoreProductAvailability(buCode, productId) {
    assert.strictEqual(typeof buCode, 'string',
      `Expected first argument buCode to be a string, instead ${typeof buCode} given.`
    );
    assert.strictEqual(typeof productId, 'string',
      `Expected first argument productId to be a string, instead ${typeof productId} given.`
    );
    buCode = String(buCode).trim();
    productId = String(productId).trim();

    const url = this.buildUrl(this.baseUrl, this.countryCode, this.languageCode, buCode, productId);
    return this.fetch(url)
      .catch(err => {
        if (err.response) {
          err.message =
            `Unable to receive product ${productId} availability for store `+
            `${buCode} status code: ${err.response.status} ${err.response.statusText}.`;
        }
        throw err;
      })
      .then(data => IOWS2.parseAvailabilityFromResponseData(data)
    );
  }

}

module.exports = IOWS2;
