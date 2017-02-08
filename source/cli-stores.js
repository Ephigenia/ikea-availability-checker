#!/usr/bin/env node
'use strict';

let program = require('commander');
let cheerio = require('cheerio');
let pkg = require('./../package.json');

program
  .version(pkg.version)
  .arguments('[countryCodes...]')
  .description(
    'Will list the IKEA stores found in a country by scraping an example ' +
    'detail page from ikea.com or other domains and extracting the store ' +
    'buCodes and names'
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

    countryCodes.forEach(function(countryCode) {
      // trying to use a fixed productId of a product which must be popular in
      // all countries
      let productId = '30275861';
      let languageCode = countryCode;
      let url = `http://www.ikea.com/${countryCode}/${languageCode}/catalog/products/${productId}/`;

      let reporter = require('./lib/reporter/stores-table');
      let request = require('request');
      request.get(url, function(err, response) {
        let $ = cheerio.load(response.body);
        let storeDropdownElm = $('#ikeaStoreNumber1');
        let stores = storeDropdownElm.find('option')
          .map(function(index, elm) {
            return {
              buCode: $(elm).attr('value'),
              name: $(elm).text().replace(/IKEA\s+/, ''),
              countryCode: countryCode,
            };
          })
          .toArray()
          // filter stores where buCode is 3-letter digit and store name is
          // not empty
          .filter(function(store) {
            return store.buCode && store.buCode.match(/^\d+$/) && store.name;
          });

        console.log(reporter.show(stores));
      }); // forEach
    }); // action
  })
  .parse(process.argv);
