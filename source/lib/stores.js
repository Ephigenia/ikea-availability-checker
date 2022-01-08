import fs from 'node:fs';

/**
 * @typedef {Object} Store
 * @property {string} buCode - unique ikea store identification number
 * @property {string} name - The name of the store, like "Augsburg",
 *   "Bratislava" or similar, also unique worldwide
 * @property {number} countryCode lowercase two-letter country code following (ISO-3166)
 */

/**
 * @type {Array<Store>}
 */
const data = JSON.parse(fs.readFileSync('source/data/stores.json'));

function normalizeCountryCode(countryCode) {
  return String(countryCode).trim().toLowerCase();
}

export default {

  data,

  /**
   * Find stores by matching the given query against the buCode, countryCode or
   * name of a store and return an array of all matching stores.
   *
   * @param {string|RegExp} query case insensitive search query
   * @param {string} [countryCode] optional additional countryCode that must
   *  match
   * @returns {Array<Store>} one or multiple stores as array
   */
  findByQuery: function(query, countryCode = false) {
    const regexp = query instanceof RegExp ? query : new RegExp(String(query), 'i');
    countryCode = countryCode ? normalizeCountryCode(countryCode) : countryCode;
    return data
      .filter(d => regexp.test(d.name) || d.buCode == query)
      .filter(d => countryCode ? d.countryCode === countryCode : true);
  },

  /**
   * @param {Array<string|number>} buCodes - array of store ids where the store should
   *   get returned
   * @returns {Array<Store>} one or no store matchting the given ids
   */
  findById: function(buCodes = []) {
    if (!Array.isArray(buCodes)) buCodes = [buCodes];
    const strCodes = buCodes.map(c => String(c));
    return data.filter(store => strCodes.indexOf(store.buCode) > -1);
  },

  /**
   * @param {string|number} buCode unique ikea store identification number
   * @returns {Store|undefined} when a store with the exact given buCode exists
   */
  findOneById: function(buCode) {
    return data.find(store => store.buCode == buCode);
  },

  /**
   * @param {string} countryCode - ISO 3166-1 alpha 2 country code whos stores
   *   should get returned. If the countrycode is not valid or known an empty
   *   array is returned
   * @returns {Store[]} list of stores from the country
   */
  findByCountryCode: function(countryCode) {
    const cc = normalizeCountryCode(countryCode);
    return data.filter(store => store.countryCode === cc);
  },

  /**
   * Returns an array with all ISO 3166-1 alpha 2 country codes that have at
   * least one store.
   * @returns {string[]} two-letter ISO 3166-2 alpha 2 country codes
   */
  getCountryCodes: function() {
    return Array.from(new Set(data.map(store => store.countryCode)));
  },

  /**
   * Transforms a ISO 3166-2 country code like "gb" to the ISO 639-2
   * language code ("en") that is supported by the IOWS endpoint.
   *
   * @param {string} countryCode lowercase ISO 3166-2 alpha 2 country code
   * @returns {string} the resulting lowercased ISO 639-2 language code
   */
  getLanguageCode: function(countryCode) {
    const cc = normalizeCountryCode(countryCode);
    // the best matching language code to use when sending requests to a
    // specific country
    const map = {
      ae: 'en',
      at: 'de',
      au: 'en',
      be: 'fr',
      ca: 'en',
      ch: 'de',
      cn: 'zh',
      cz: 'cs',
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
