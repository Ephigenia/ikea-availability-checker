'use strict';

const debug = require('debug')('ikea-scraper');
const request = require('request');
const cheerio = require('cheerio');

module.exports = class Scraper {

  constructor(countryCode, languageCode) {
    this.baseUrl = 'http://www.ikea.com/' + countryCode + '/' + languageCode;
  }

  get(url) {
    return new Promise((resolve, reject) => {
      debug('GET', url);
      request.get(url, (err, response) => {
        debug('RECEIVED', 'statusCode:', response.statusCode, 'bytes:', response.body.length);
        if (err) {
          reject(new Error(err));
        }
        resolve(response);
      });
    });
  }

  parseProductCollections(body) {
    const $ = cheerio.load(body);
    // search in the product list for the query
    const productCollections = $('.productsAzLink')
      .toArray()
      .map(function(elm) {
        const name = $(elm).text().trim();
        const uri = $(elm).find('a').attr('href');
        const url = 'http://www.ikea.com' + uri;
        const id = uri.replace(/(.+)\/([a-z0-9]+)\/$/i, '$2');
        return { id, name, url, uri };
      });
    return Promise.resolve(productCollections);
  }

  getProductCollections(letterCode) {
    const url = this.baseUrl + '/catalog/productsaz/' + letterCode + '/';
    return this.get(url)
      .then(response => this.parseProductCollections(response.body));
  }

  parseProducts(body) {
    const $2 = cheerio.load(body);
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
    return productList;
  }

  getProductsFromCollectionUrl(url) {
    return this.get(url)
      .then(response => this.parseProducts(response.body));
  }
};
