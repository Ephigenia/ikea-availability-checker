const request = require('request');
const xml2js = require('xml2js');

let iows = {};

iows.parseResponse = function(response, done) {
  // @TODO add error handling when response is no xml or status code is wrong
  parser = new xml2js.Parser({
    // options for json parsing
    // https://www.npmjs.com/package/xml2js
    trim: true, // Trim the whitespace at the beginning and end of text nodes.
    parseNumbers: true,
    explicitArray: false,
    mergeAttrs: true, // put attributes as object keys
  });
  return parser.parseString(response.body, done);
};

iows.parseAvailabilityFromResponse = function(response, done) {
  iows.parseResponse(response, function(err, json) {
    if (err) return done(err);
    return done(null, json['ir:ikea-rest'].availability.localStore);
  });
};

iows.country = function(countryCode) {
  let country = {
    code: countryCode,
    product: function(productId) {
      let product = {
        id: productId,
        availability: function(done) {
          let url = 'http://www.ikea.com/' + countryCode +
            '/iows/catalog/availability/' + productId;
          return request(url, function(err, response) {
            if (err) return done(err);
            iows.parseAvailabilityFromResponse(response, done);
          });
        },
      };
      return product;
    },
  };

  return country;
};

module.exports = iows;
