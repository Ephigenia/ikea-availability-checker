'use strict';

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
        languageCode = 'en';
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
