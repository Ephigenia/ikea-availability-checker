#!/usr/bin/env node
'use strict';

let program = require('commander');
const cheerio = require('cheerio');
const pkg = require('./../package.json');
const request = require('request');

const debug = require('debug')('ikea');
const stores = require('./lib/stores');

program
  .version(pkg.version)
  .arguments('[countryCodes...]')
  .description(
    'Will list the IKEA stores found in a country by scraping an example ' +
    'detail page from ikea.com or other domains and extracting the store ' +
    'buCodes and names'
  )
  .option(
    '-r, --reporter [reporter]',
    'define the reporter which should be used to print out the results, ' +
    'by default the results are shown as human readable tables grouped by ' +
    'country and product. Alternatively the results can be shown as plain ' +
    'JSON objects for further processing.',
    /^json|table$/,
    'table'
  )
  .action(function(countryCodes) {
    // make countryCodes unique and lowercase
    countryCodes = countryCodes
      .map(function(countryCode) {
        return countryCode.toLowerCase();
      })
      .filter(function(cur, i, arr) {
        return arr.indexOf(cur, i + 1) === -1;
      });

    // some of the ikea country pages are not supported by the cli script
    // check for such codes and exit before scraping anything
    let foundUnsupportedCountryCodes = countryCodes.reduce(function(list, val) {
      if (stores.isSupportedCountryCode(val)) return list;
      list.push(val);
      return list;
    }, []);
    if (foundUnsupportedCountryCodes.length > 0) {
      foundUnsupportedCountryCodes.forEach(function(countryCode) {
        const err = new Error(`The given country code "${countryCode}" is not supported.`);
        console.error(err.message);
        process.exit(1);
      });
      process.exit(1);
    }

    let reporter = null;
    if (program.reporter === 'json') {
      reporter = require('./lib/reporter/' + program.reporter);
    } else {
      reporter = require('./lib/reporter/stores-' + program.reporter);
    }

    countryCodes.forEach(function(countryCode) {
      // trying to use a fixed productId of a product which must be popular in
      // all countries
      let productId = '30275861';
      let languageCode = stores.getLanguageCode(countryCode);

      switch(countryCode) {
        case 'bg':
          productId = '00278856';
          break;
        case 'jp':
          productId = 'S79197598';
          break;
        case 'kr':
          productId = 'S79197598';
          break;
        case 'aa':
        case 'au':
        case 'hk':
        case 'my':
        case 'sg':
        case 'th':
          languageCode = 'en';
          productId = '00278856';
          break;
        case 'cn':
        case 'tw':
          languageCode = 'zh';
          productId = '00278856';
          break;
      }

      let url = `http://www.ikea.com/${countryCode}/${languageCode}/catalog/products/${productId}/`;
      debug('GET', url);

      request.get(url, function(err, response) {
        debug('RECEIVED', response.statusCode, response.body.length);
        let $ = cheerio.load(response.body);
        let storeDropdownElm = $('#ikeaStoreNumber1')[0];
        let foundStores = $(storeDropdownElm).find('option')
          .map(function(index, elm) {
            return {
              buCode: $(elm).attr('value'),
              name: $(elm).text().replace(/IKEA\s+/, ''),
              countryCode: countryCode,
            };
          })
          .toArray()
          // filter foundStores where buCode is 3-letter digit and store name is
          // not empty
          .filter(function(store) {
            return store.buCode && store.buCode.match(/^\d+$/) && store.name;
          });

        console.log(reporter.show(foundStores));
      }); // forEach
    }); // action
  })
  .parse(process.argv);
