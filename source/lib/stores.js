'use strict';

/**
 * A song
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
  findNameByBuCode: function(buCode) {
    buCode = String(buCode);
    let store = data.find(function(store) {
      return store.buCode === buCode;
    });
    if (store) {
      return store.name;
    }
    return null;
  },

  /**
   * @param {String} countryCode - ISO 3166-1 alpha 2 country code whos stores
   *   should get returned. If the countrycode is not valid or known an empty
   *   array is returned
   * @returns {Array<Store>} one or multiple stores as array
   */
  getStoresForCountry: function(countryCode) {
    return data.filter(d => d.countryCode === countryCode);
  },

  /**
   * @param {String} query
   * @returns {Array<Store>} one or multiple stores as array
   */
  getStoresMatchingQuery: function(query) {
    const regexp = new RegExp(query.toLowerCase(), 'i');
    return data.filter(d => regexp.test(d.name));
  },

  /**
   * @param {Array<String>} storeIds - array of store ids where the store should
   *   get returned
   * @returns {Array<Store>} one or no store matchting the given ids
   */
  getStoresById: function(storeIds = []) {
    if (!Array.isArray(storeIds)) return [];
    return data.filter(d => storeIds.indexOf(d.buCode) > -1);
  },

  /**
   * @param {String} countryCode - ISO 3166-1 alpha 2 country code
   * @returns {String} ISO 3166-1 alpha 2 language code
   */
  getLanguageCode: function(countryCode) {
    let languageCode = countryCode;
    switch(countryCode) {
      case 'cz':
        languageCode = 'cs';
        break;
      case 'dk':
        languageCode = 'da';
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
      case 'aa':
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
  },

  isSupportedCountryCode: function(code) {
    const unsupportedCountryCodes = [
      'bg',
      'cy',
      'do',
      'eg',
      'es_islas',
      'gb',
      'gr',
      'id',
      'ie',
      'in',
      'is',
      'lio',
      'ma',
      'rs',
      'tr',
    ];
    return unsupportedCountryCodes.indexOf(code) === -1;
  }
};
