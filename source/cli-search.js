#!/usr/bin/env node
'use strict';

let program = require('commander');
const cheerio = require('cheerio');
const pkg = require('./../package.json');
const request = require('request');
const Fuse = require('fuse.js');
const Table = require('cli-table');

const stores = require('./lib/stores');
const debug = require('debug')('ikea');
const Scraper = require('./lib/scraper');

program
  .version(pkg.version)
  .arguments('[productName]')
  .description(
    'Search for a specific product group name. By the nature of the ikea ' +
    'website the search can only match when the product’s name starts with ' +
    'the given query. After that the query uses fuzzy matching to find the ' +
    'the appropriate product collection and then lists all products assigned ' +
    'to it with price, id, url, imageUrl'
  )
  .option(
    '-c, --country [countryCodes]',
    'optional single 2-letter country code or multiple country code ' +
    'separated by comma, default value is "de" which would list the ' +
    'availability for all stores in germany',
    'de'
  )
  .action(function(query) {
    if (!stores.isSupportedCountryCode(program.country)) {
      const err = new Error(`The given country code "${program.country}" is not supported.`);
      console.error(err.message);
      process.exit(1);
    }
    // @TODO validate query string, min length = 1
    const countryCode = program.country;
    // @TODO determine language code from counrtycode using the list from
    // cli-stores
    const languageCode = stores.getLanguageCode(countryCode);

    // the url contains a integer value which is the first letter of the search
    // query 0 = A, Z = 25
    const firstLetter = query.substr(0, 1).toLowerCase();
    const letterCode = firstLetter.charCodeAt(0) - 97;

    // @TODO error when letterCode is not betewen 0 and 25
    if (letterCode < 0 || letterCode > 25) {
      const err = new Error(`The given query starts with an invalid character and cannot be used.`);
      console.error(err.message);
      process.exit(1);
    }

    const scraper = new Scraper(countryCode, languageCode);

    scraper.getProductCollections(letterCode).then((productCollections) => {
      // search the query in the product collection list using fuse.js which
      // provides fuzzy search
      var opts = {
        keys: ['name'],
        shouldSort: true,
        includeScore: true,
      }
      console.log(productCollections);
      const fuse = new Fuse(productCollections, opts);
      return fuse.search(query);
    }).then((matches) => {
      debug('found ' + matches.length + ' matches');
      if (matches.length === 0) {
        throw new Error(
          'The given query "' + query +'" with the country code ' +
          '"' + countryCode + '" did not lead to any product groups or ' +
          'collections matching the query. The query always matches with the ' +
          'first letter so be sure that the first letter of the query is ' +
          'correct.'
        );
      }
      return matches[0].item;
    }).then(firstCollection => {
      // when there was something found, scrape the collection page and list
      // all products on that page in a table
      return scraper.getProductsFromCollectionUrl(firstCollection.url);
    }).then((products) => {
      // show the results as a well printed table
      const table = new Table({
        head: [
          'name',
          'price',
          'id',
          'uri',
          'imageUri',
        ],
        colAligns: [null, 'right', 'right']
      });
      // transform the array of objects to array of arrays
      products.map(product => table.push([
        product.name, product.price, product.id, product.uri, product.imageUri
      ]));
      console.log(table.toString());
      process.exit(0);
    }).catch(err => {
      console.error(err.message);
      process.exit(1);
    });
  })
  .parse(process.argv);
