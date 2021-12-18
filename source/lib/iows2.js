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
   * @throws {import('./errors').IOWS2ParseError} in case the response
   *   body is not an object
   * @throws {import('./errors').IOWS2NotFoundError} in case the response
   *   status code is 404
   * @throws {import('./errors').IOWS2DeprecatedError} in case the response
   *   contains a "deprecation" header
   * @throws {import('./errors').IOWS2ResponseError} in any other case
   */
  async fetch(url, options = {}) {
    let response;
    try {
      response = await this.api.get(url, options);
    } catch (error) {
      if (error.request) {
        // 20211217 some of the country endpoints started to reply with a
        // deprecation and warning header stating that the IOWS2 API is
        // going to be deprecated.
        const responseHeaders = error.request.res.headers;
        if (responseHeaders.deprecation) {
          throw new errors.IOWS2DeprecatedError(error);
        }
        if (error.request.res.statusCode === 404) {
          throw new errors.IOWS2NotFoundError(error);
        }
      }
      throw new errors.IOWS2ResponseError(error);
    }

    // double check if the response was successfully parsed and is an object
    if (typeof response.data !== 'object') {
      throw new errors.IOWS2ParseError('Unable to parse response', response.data);
    }

    return response.data;
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
   * @param {string} productId
   * @returns {string}
   */
  normalizeProductId(productId) {
    return String(productId || '').replace(/\./g, '').trim();
  }

  /**
   * Normalize the buCode
   *
   * Note that the buCode "003" must keep the zeros
   *
   * @param {string} buCode
   * @returns {string}
   */
  normalizeBuCode(buCode) {
    return String(buCode || '').replace(/[^0-9]/g, '');
  }

  /**
   * Asynchronsouly request the stock information of a specific product in
   * the given store.
   *
   * @param {string} buCode 3-digit ikea store identification number
   * @param {string|number} productId ikea product identification number
   * @param {PRODUCT_TYPE} [productType=PRODUCT_TYPE.ART] optional different
   *   product type. The product type is guessed from the product ID.
   * @returns {Promise<ProductAvailability>} resulting product stock
   *   information
   */
  async getStoreProductAvailability(buCode, productId, productType = PRODUCT_TYPE.ART) {
    assert.strictEqual(typeof buCode, 'string',
      `Expected first argument buCode to be a string, instead ${typeof buCode} given. (ea6471f8)`
    );
    assert.ok(['string', 'number'].includes(typeof productId),
      `Expected second argument productId to be a string or number, instead ${typeof productId} given. (5492aeea)`
    );
    buCode = this.normalizeBuCode(buCode);
    productId = this.normalizeProductId(productId);

    // detect non ART product codes by checking if the product code starts with
    // an "S"
    if (productId[0].toLowerCase() === 's') {
      productType = PRODUCT_TYPE.SPR;
      productId = productId.substring(1);
    }

    assert(
      /^\d+$/.test(buCode),
      `The given buCode ${JSON.stringify(buCode)} doesn’t look like a valid buCode id (b92bb3e4)`,
    );
    assert(
      /^\d+$/.test(productId),
      `The given productId ${JSON.stringify(productId)} doesn’t look like a valid product id (06a5d687)`,
    );

    const url = this.buildUrl(this.baseUrl, this.countryCode, this.languageCode, buCode, productId, productType);
    return this.fetch(url)
      .catch(err => {
        if (err.request.res) {
          err.message =
            `Unable to receive product ${productId} availability for store ` +
            `${buCode} status code: ${err.request.res.statusCode} ${err.request.res.statusText} ` +
            `using url: ${err.request.path}`;
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
