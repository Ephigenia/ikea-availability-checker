'use strict';

const axios = require('axios');
const assert = require('assert');
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
 * @property {Date} date
 *   instance of a date for which the estimation is made
 * @property {number} stock
 *   estimated number of items in stock on the forecasted date
 * @property {ProductAvailabilityProbability} probability
 *   probability of the product beeing in store ("LOW", "MEDIUM" or "HIGH")
 */

/**
 * @typedef {object} ProductAvailability
 * @property {Date} createdAt instance of a javascript date of the moment when
 *   the data was created.
 * @property {ProductAvailabilityProbability} probability
 *   probability of the product beeing in store ("LOW", "MEDIUM" or "HIGH")
 * @property {string} productId
 *   ikea product identification number
 * @property {string} buCode
 *   ikea store identification number
 * @property {number} stock
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
   * @param {string} countryCode - required ISO 3166-1 alpha-2 country code
   * @param {string} [languageCode=''] - optional ISO 3166-1 alpha-2 country code
   * @param {import('axios').AxiosRequestConfig} options optional default axios
   *   options
   */
  constructor(countryCode, languageCode = '', options = {}) {
    assert.strictEqual(typeof countryCode, 'string',
      `Expected first argument countryCode to be a string, instead ${typeof countryCode} given. (5dce2bae)`
    );
    if (languageCode) {
      assert.strictEqual(typeof languageCode, 'string',
        `Expected second argument languageCode to be a string, instead ${typeof languageCode} given. (2284d602)`
      );
    }
    // TODO should country codes be validated against the list of stores?
    /** @type {string} normalized two-letter country code */
    this.countryCode = String(countryCode).trim().toLocaleLowerCase();
    /** @type {string} normalized two-letter language code */
    this.languageCode = (languageCode || stores.getLanguageCode(countryCode)).trim().toLowerCase();
    /** @type {string} base URL to the iows api endpoint */
    this.baseUrl = 'https://iows.ikea.com/retail/iows';
    this.api = axios.create({
      timeout: 5000,
      headers: {
        'Accept': 'application/vnd.ikea.iows+json;version=1.0',
        'Contract': '37249',
        'Consumer': 'MAMMUT',
      },
      ...options,
    })
  }

  /**
   * @param {string} url required request url
   * @param {import('axios').AxiosRequestConfig} [options={}] additional
   *   options
   * @return {Promise<Object>} response body data
   * @throws {import('./errors').IOWS2ResponseError}
   */
  async fetch(url, options = {}) {
    // required headers, without them IOWS endpoint will return
    // 409 (gone), 401 or even 404
    return this.api.get(url, options)
      .then(response => {
        if (typeof response.data !== 'object') {
          throw new errors.IOWS2ParseError('Unable to parse response');
        }
        return response.data;
      })
      .catch(err => {
        throw new errors.IOWS2ResponseError(err);
      });
  }

  /**
   * @param {object} data plain iows endpoint response data object
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
      baseUrl,
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
   * @param {string} buCode ikea store identification number
   * @param {string} productId ikea product identification number
   * @param {PRODUCT_TYPE} [productType=PRODUCT_TYPE.ART] optional different
   *   product type. The product type is guessed from the product ID.
   * @returns {Promise<ProductAvailability>} resulting product stock
   *   information
   */
  async getStoreProductAvailability(buCode, productId, productType = null) {
    assert.strictEqual(typeof buCode, 'string',
      `Expected first argument buCode to be a string, instead ${typeof buCode} given. (ea6471f8)`
    );
    assert.strictEqual(typeof productId, 'string',
      `Expected first argument productId to be a string, instead ${typeof productId} given. (5492aeea)`
    );
    buCode = String(buCode).trim();
    productId = String(productId).trim().replace('.', '');

    if (!productType) {
      productType = PRODUCT_TYPE.ART;
      // it looks like SPR product types always have an "s" in front of
      // the productcode
      if (productId[0].toLowerCase() === 's') {
        productType = PRODUCT_TYPE.SPR;
        productId = productId.substr(1);
      }
    }

    const url = this.buildUrl(this.baseUrl, this.countryCode, this.languageCode, buCode, productId, productType);
    return this.fetch(url)
      .catch(err => {
        if (err.response) {
          err.message =
            `Unable to receive product ${productId} availability for store ` +
            `${buCode} status code: ${err.response.status} ${err.response.statusText} ` +
            `using url: ${err.request.url}`;
        }
        throw err;
      })
      .then(data => {
        try {
          return {
            buCode,
            productId,
            ...IOWS2.parseAvailabilityFromResponseData(data)
          };
        } catch (err) {
          throw new errors.IOWS2ParseError('Unable to parse valid looking response: ' + err.message, data);
        }
      });
  }
}

module.exports = IOWS2;
