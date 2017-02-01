var request = require('request');
var xml2js = require('xml2js');
var Table = require('cli-table');

var buCodes = require('./buCodes');

function url(countryCode, productId) {
  var countryCode = countryCode + '/' + countryCode;
  http://www.ikea.com/de/de/iows/catalog/availability/S49903093
  return 'http://www.ikea.com/' + countryCode +
    '/iows/catalog/availability/' + productId;
}

var u = url('de', 'S49903093');
request(u, function(err, response, body) {
  // @TODO add err handling
  // body contains a xml which contains <localStore> nodes for each ikea
  // store in the county. Each store has a "buCode" which defines the location.

  parser = new xml2js.Parser({
    // options for json parsing
    // https://www.npmjs.com/package/xml2js
    trim: true, // Trim the whitespace at the beginning and end of text nodes.
    parseNumbers: true,
    mergeAttrs: true // put attributes as object keys
  });
  parser.parseString(body, function(err, json) {
    var storeList = json['ir:ikea-rest'].availability[0].localStore;

    var table = new Table({
      header: ['Location', 'Stock', 'Probability'],
      colAligns: [null, 'right', 'right'],
      style: {
        head: ['white']
      }
    });

    storeList.forEach(function(item) {
      var location = buCodes.lookup(item.buCode);
      table.push([
        item.buCode + ' ' + (location? location.city : '[unknown]'),
        item.stock[0].availableStock,
        item.stock[0].inStockProbabilityCode
      ]);
    });

    console.log(table.toString());

  });
});
