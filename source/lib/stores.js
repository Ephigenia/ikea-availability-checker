'use strict';

/**
 * @typedef {Object} Store
 * @property {string} buCode - the so called "bu"-code of the store which is
 *   internationally unique
 * @property {string} name - The name of the store, like "Augsburg",
 *   "Bratislava" or similar, also unique worldwide
 * @property {number} countryCode - ISO 3166-1 alpha-2 country code where the
 *   store is located
 */

let data = require('./../data/stores.json');

module.exports = {
  /**
   * @param {String} query - search query (case-insensitive)
   * @param {String} [countryCode] - optional additional countryCode that must
   *  match
   * @returns {Array<Store>} one or multiple stores as array
   */
  getStoresMatchingQuery: function(query, countryCode) {
    const regexp = new RegExp(query.toLowerCase(), 'i');
    return data
      .filter(d => regexp.test(d.name) || d.buCode == query)
      .filter(d => countryCode ? d.countryCode === countryCode : true);
  },

  /**
   * @param {Array<String>} buCodes - array of store ids where the store should
   *   get returned
   * @returns {Array<Store>} one or no store matchting the given ids
   */
  getStoresById: function(buCodes = []) {
    if (!Array.isArray(buCodes)) return [];
    return data.filter(store => buCodes.indexOf(store.buCode) > -1);
  },

  /**
   * @param {String} countryCode - ISO 3166-1 alpha 2 country code whos stores
   *   should get returned. If the countrycode is not valid or known an empty
   *   array is returned
   * @returns {String} ISO 3166-1 alpha 2 language code
   */
  findByCountryCode: function(countryCode) {
    const cc = String(countryCode).trim().toLowerCase();
    return data.filter(store => store.countryCode === cc);
  },

  /**
   * Returns an array with all ISO 3166-1 alpha 2 country codes that have at
   * least one store.
   * @returns {String[]} two-letter ISO 3166-2 alpha 2 country codes
   */
  getCountryCodes: function() {
    return Array.from(new Set(data.map(store => store.countryCode)));
  },

  getLanguageCode: function(countryCode) {
    const cc = String(countryCode).trim().toLowerCase();
    // the best matching language code to use when sending requests to a
    // specific country
    const map = {
      cz: 'cs',
      ae: 'en',
      at: 'de',
      au: 'en',
      ca: 'en',
      ch: 'de',
      cn: 'zh',
      dk: 'da',
      gb: 'en',
      hk: 'en',
      ie: 'en',
      jo: 'en',
      jp: 'ja',
      kr: 'ko',
      kw: 'en',
      my: 'en',
      qa: 'en',
      sa: 'en',
      se: 'sv',
      sg: 'en',
      th: 'en',
      tw: 'zh',
      us: 'en',
    };

    return map[String(cc)] || cc;
  }
};
