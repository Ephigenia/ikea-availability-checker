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

    const url = 'http://www.ikea.com/' +
      countryCode + '/' + languageCode +
      '/catalog/productsaz/' + letterCode
      '/';
    debug('GET', url);
    request.get(url, (err, response) => {
      // @TODO throw err
      debug('RECEIVED', 'statusCode:', response.statusCode, 'bytes:', response.body.length);
      const $ = cheerio.load(response.body);
      // search in the product list for the query
      const productCollections = $('.productsAzLink').toArray()
        .map(function(elm) {
          const name = $(elm).text();
          const uri = $(elm).find('a').attr('href');
          const url = 'http://www.ikea.com' + uri;
          const id = uri.replace(/(.+)\/([a-z0-9]+)\/$/i, '$2');
          return { id, name, url, uri };
        });

      // search the query in the product collection list
      var options = {
        keys: ['name'],
        shouldSort: true,
        includeScore: true,
      }
      const fuse = new Fuse(productCollections, options);
      const matches = fuse.search(query);

      debug('found ' + matches.length + ' matches');
      if (matches.length === 0) {
        console.error(
          'The given query "' + query +'" with the country code ' +
          '"' + countryCode + '" did not lead to any product groups or ' +
          'collections matching the query. The query always matches with the ' +
          'first letter so be sure that the first letter of the query is ' +
          'correct.'
        );
        process.exit();
      }

      // when there was something found, scrape the collection page and list
      // all products on that page in a table
      const url2 = matches[0].item.url;
      debug('GET', url2);
      request.get(url2, (err, response) => {
        // @TODO throw err
        debug('RECEIVED', 'statusCode:', response.statusCode, 'bytes:', response.body.length);

        // parsing the products out of the html body
        const $2 = cheerio.load(response.body);
        const productList = $2('.product').toArray()
          .map(elm => {
            const imageUri = $2(elm).find('.image img').attr('src');
            const uri = $2(elm).find('.productLink').attr('href');
            const price = $2(elm).find('.price').text().trim().split(/\r\n/)[0];
            // extract product id from the product detail page uri
            const id = uri.replace(/(.+)\/([a-z0-9]+)\/$/i, '$2');
            const name = $2(elm).find('.productTitle').text().trim() + ' ' +
              $2(elm).find('.productDesp').text().trim();
            return { name, price, id, uri, imageUri };
          });

        // generate report
        const table = new Table({
          head: [
            'name',
            'price',
            'id',
            'uri',
            'imageUri',
          ],
          colAligns: ['left', 'right', 'right']
        });
        productList
          .map(product => [
            product.name, product.price, product.id, product.uri, product.imageUri
          ])
          .map(item => table.push(item));

        console.log(table.toString());
      }); // request url2
    }); // request
  })
  .parse(process.argv);
