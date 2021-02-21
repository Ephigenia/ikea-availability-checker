'use strict';

const fetch = require('node-fetch');
const assert = require('assert');

const pkg = require('./../../package.json')
const debug = require('debug')(pkg.name);
const stores = require('./stores');

const PRODUCT_TYPE = {
  ART: 'ART',
  SPR: 'SPR',
};

/**
 * @typedef {('LOW'|'MEDIUM'|'HIGH')} ProductAvailabilityProbability
 */

/**
 * @typedef {object} ProductAvailabilityForecastItem
 * @property {createdAt} date
 *   instance of a date for which the estimation is made
 * @property {number} stock
 *   estimated number of items in stock on the forecasted date
 * @property {ProductAvailabilityProbability} probability
 *   probability of the product beeing in store ("LOW", "MEDIUM" or "HIGH")
 */

/**
 * @typedef {Object} ProductAvailability
 * @property {Date} createdAt instance of a javascript date of the moment when
 *   the data was created.
 * @property {ProductAvailabilityProbability} probability
 *   probability of the product beeing in store ("LOW", "MEDIUM" or "HIGH")
 * @property {string} productId
 *   ikea product identification number
 * @property {string} buCode
 *   ikea store identification number
 * @property {Number} stock
 *   number of items currently in stock
 * @property {ProductAvailabilityForecastItem[]} [forecast=[]]
 *   when available a list of items indicating the estimated stock amount in the
 *   next days
 * @property {Date} [restockDate]
 *   Estimated date when the item gets restocked. Can be empty
 */

const errors = require('./iows2Errors');

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
    // TODO should country codes be validated against the list of stores?
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
    // required headers, without them IOWS endpoint will return
    // 409 (gone), 401 or even 404
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
          const err = new errors.IOWS2ResponseError(`Unexpected http status code ${response.status}`);
          // add context variables to error object for provide more information
          err.request = { url, params: params };
          err.response = response;
          throw err;
        }
        return response.json();
      });
  }

  /**
   * @param {object<string, any>} data plain iows endpoint response data object
   * @returns {ProductAvailability} transformed stock information
   */
  static parseAvailabilityFromResponseData(data) {
    const availability = data.StockAvailability;

    // AvailableStockForecastList can contain estimated stock amounts in the
    // next 4 days.
    const forecastData = (availability.AvailableStockForecastList || {}).AvailableStockForecast || [];
    const forecast = forecastData.map(item => ({
      stock: parseInt(item.AvailableStock.$, 10),
      date: new Date(item.ValidDateTime.$),
      probability: item.InStockProbabilityCode.$,
    }));

    // RestockDateTime may contain an estimated date when the product gets
    // restocked. It also can be missing in the response
    let restockDate = null;
    if (availability.RetailItemAvailability && availability.RetailItemAvailability.RestockDateTime) {
      restockDate = new Date(availability.RetailItemAvailability.RestockDateTime.$);
    }

    const stock = availability.RetailItemAvailability.AvailableStock.$;
    const probability = availability.RetailItemAvailability.InStockProbabilityCode.$;
    return {
      createdAt: new Date(),
      forecast,
      probability,
      restockDate,
      stock: parseInt(stock, 10),
    };
  }

  buildUrl(baseUrl, countryCode, languageCode, buCode, productId, productType = PRODUCT_TYPE.ART) {
    return [
      this.baseUrl,
      encodeURIComponent(this.countryCode),
      encodeURIComponent(this.languageCode),
      'stores',
      buCode,
      'availability',
      productType,
      encodeURIComponent(productId)
    ].join('/');
  }

  /**
   * Asynchronsouly request the stock information of a specific product in
   * the given store.
   *
   * @param {String} buCode ikea store identification number
   * @param {String} productId ikea product identification number
   * @param {PRODUCT_TYPE} [productType=PRODUCT_TYPE.ART] optional different
   *   product type. The product type is guessed from the product ID.
   * @returns {Promise<ProductAvailability>} resulting product stock
   *   information
   */
  async getStoreProductAvailability(buCode, productId, productType = null) {
    assert.strictEqual(typeof buCode, 'string',
      `Expected first argument buCode to be a string, instead ${typeof buCode} given.`
    );
    assert.strictEqual(typeof productId, 'string',
      `Expected first argument productId to be a string, instead ${typeof productId} given.`
    );
    buCode = String(buCode).trim();
    productId = String(productId).trim();

    if (!productType) {
      productType = PRODUCT_TYPE.ART;
      // it looks like SPR product types always have an "s" in front of
      // the productcode
      if (productId.substr(0, 1).toLowerCase() === 's') {
        productType = PRODUCT_TYPE.SPR;
        productId = productId.substr(1);
      }
    }

    const url = this.buildUrl(this.baseUrl, this.countryCode, this.languageCode, buCode, productId, productType);
    return this.fetch(url)
      .catch(err => {
        if (err.response) {
          err.message =
            `Unable to receive product ${productId} availability for store `+
            `${buCode} status code: ${err.response.status} ${err.response.statusText} ` +
            `using url: ${err.request.url}`;
        }
        throw err;
      })
      .then(data => {
        let parsed = {
          buCode,
          productId,
        };
        try {
          parsed = Object.assign(parsed, IOWS2.parseAvailabilityFromResponseData(data));
        } catch (err) {
          let error = new errors.IOWS2ParseError('Unable to parse valid looking response: ' + err.message);
          error.data = data;
          throw error;
        }
        return parsed;
      });
  }
}

module.exports = IOWS2;
