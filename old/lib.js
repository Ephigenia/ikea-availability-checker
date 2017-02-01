var request = require('request');
var xml2js = require('xml2js');
var async = require('async');

module.exports = function(countryCode) {
  // @TODO validate arguments

  function query(countryCode, productId, done) {
    // @TODO validate arguments
    var url = 'http://www.ikea.com/' + countryCode + '/' + countryCode +
      '/iows/catalog/availability/' + productId;
    async.waterfall([
      async.apply(request, url),
      function parseResponse(response, body, next) {
        parser = new xml2js.Parser({
          // options for json parsing
          // https://www.npmjs.com/package/xml2js
          trim: true, // Trim the whitespace at the beginning and end of text nodes.
          parseNumbers: true,
          mergeAttrs: true // put attributes as object keys
        });
        parser.parseString(body, next)
      }
    ], done);
  }


  return {
    product: function(productId) {
      return {
        availability: function(done) {
          query(countryCode, productId, function(err, body) {
            if (err) {
              return done(err);
            }
            var storeList = json['ir:ikea-rest'].availability[0].localStore);
            return done(null, storeList);
          });
        }
      }
    }
  };
};
