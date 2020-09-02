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
    let languageCode = String(countryCode).trim().toLowerCase();
    switch(languageCode) {
      case 'cz':
        languageCode = 'cs';
        break;
      case 'dk':
        languageCode = 'da';
        break;
      case 'gb':
        languageCode = 'en';
        break;
      case 'ie':
        languageCode = 'en';
        break;
      case 'lio':
        languageCode = 'en';
        break;
      case 'jp':
        languageCode = 'ja';
        break;
      case 'kr':
        languageCode = 'ko';
        break;
      case 'se':
        languageCode = 'sv';
        break;
      case 'au':
      case 'hk':
      case 'my':
      case 'sg':
      case 'th':
        languageCode = 'en';
        break;
      case 'cn':
      case 'tw':
        languageCode = 'zh';
        break;
      case 'ae':
      case 'ca':
      case 'jo':
      case 'kw':
      case 'qa':
      case 'sa':
      case 'us':
        languageCode = 'en';
        break;
      case 'at':
      case 'ch':
        languageCode = 'de';
        break;
    }
    return languageCode;
  }
};
