'use strict';

const debug = require('debug')('ikea-scraper');
const request = require('request');
const cheerio = require('cheerio');

module.exports = class Scraper {

  constructor(countryCode, languageCode) {
    this.baseUrl = 'http://www.ikea.com/' + countryCode + '/' + languageCode;
  }

  get(url) {
    if (typeof url !== 'string') {
      return Promise.reject(new TypeError('Expected url to be a valid string'));
    }
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
    if (typeof body !== 'string') {
      return Promise.reject(new TypeError('Expected body to be a valid string'));
    }
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
    if (typeof letterCode !== 'number') {
      return Promise.reject(new TypeError(
        'Expected letterCode to be a valid integer'
      ));
    }
    if (letterCode < 0 || letterCode > 25) {
      return Promise.reject(new Error(
        `The given query starts with an invalid character and cannot be used.`
      ));
    }
    const url = this.baseUrl + '/catalog/productsaz/' + letterCode + '/';
    return this.get(url)
      .then(response => this.parseProductCollections(response.body));
  }

  parseProducts(body) {
    if (typeof body !== 'string') {
      return Promise.reject(new TypeError('Expected body to be a valid string'));
    }
    const $ = cheerio.load(body);
    const productList = $('.product').toArray()
      .map(elm => {
        const imageUri = $(elm).find('.image img').attr('src');
        const uri = $(elm).find('.productLink').attr('href');
        const price = $(elm).find('.price').text().trim().split(/\r\n/)[0];
        // extract product id from the product detail page uri
        const id = uri.replace(/(.+)\/([a-z0-9]+)\/$/i, '$2');
        const name = $(elm).find('.productTitle').text().trim() + ' ' +
          $(elm).find('.productDesp').text().trim();
        return { name, price, id, uri, imageUri };
      });
    return Promise.resolve(productList);
  }

  getProductsFromCollectionUrl(url) {
    if (typeof url !== 'string') {
      return Promise.reject(new TypeError('Expected url to be a valid string'));
    }
    return this.get(url)
      .then(response => this.parseProducts(response.body));
  }
};
