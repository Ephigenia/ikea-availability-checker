var request = require('request');
var cheerio = require('cheerio');
var everyLimit = require('async/everyLimit');

var productId = '80214549';

function getStores(countryCode, productId, cb) {
  var url = 'http://www.ikea.com/' + countryCode + '/catalog/products/' + productId;
  switch(countryCode) {
    case 'id/in':
      productId = '20239270';
      url = 'http://www.ikea.com/' + countryCode + '/catalog/products/' + productId
      break;
    case 'th/th':
    case 'kr/ko':
    case 'cn/zh':
      productId = '20315283';
      url = 'http://www.ikea.com/' + countryCode + '/catalog/products/' + productId
      break;
    case 'au/en':
      productId = '60250166';
      url = 'http://www.ikea.com/' + countryCode + '/catalog/products/' + productId
      break;
    case 'qa/en':
      productId = 'S89903091';
      url = 'http://www.ikea.com/' + countryCode + '/catalog/products/' + productId
      break;
    case 'ca/en':
    case 'us/en':
      productId = '20245370'; // Hemnes White
      url = 'http://www.ikea.com/' + countryCode + '/catalog/products/' + productId
      break;
    case 'sk/sk':
    case 'ro/ro':
    case 'lt/lt':
    case 'hr/hr':
    case 'hu/hu':
    case 'jo/en':
      productId = '40282130';
      url = 'http://www.ikea.com/' + countryCode + '/catalog/products/' + productId
      break;
    case 'ma/fr':
      url = 'http://fr.ikea.com/' + countryCode + '/catalog/products/' + productId
      break;
  }
  var options = {
    gzip: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
    },
    timeout: 5000
  };
  request(url, options, function(err, response, body) {
    if (err) {
      throw err;
    }
    var $ = cheerio.load(body);
    var stores = {};
    $('#ikeaStoreDiv select option').each(function(index, elm) {
      var id = parseInt($(this).attr('value'), 10);
      if (isNaN(id)) {
        return;
      }
      var name = $(this).text();
      // strip IKEA and spaces from the name
      name = name.replace(/^\s+|\s+$|(IKEA|ИКЕА)\s+/g, '');
      stores[id] = name;
    });
    cb(err, stores);
  });
}

var i = 0;
var countryCodes = [
  'ae/en', // United Arab Emirates
  'at/de', // Austria
  'au/en', // Australia
  'be/nl', // Belgium
  'ca/en', // Canada
  'ch/fr', // Switzerland
  'cn/zh', // China
  'cz/cs', // Czech Republic
  'de/de', // Germany
  'eg/en', // Egypt
  'es/es', // Espania
  'fi/fi', // Finland
  'fr/fr', // France
  'fr/fr', // France
  'gb/en', // Great Britain
  'hr/hr', // Croatia
  'hu/hu', // Hungary
  'id/in', // Indonesia
  'it/it', // Italy
  'jo/en', // Jordan
  'kr/ko', // South Korea
  'lt/lt', // Lithuania
  'ma/fr', // Morocco
  'nl/nl', // Netherlands
  'no/no', // Norway
  'pl/pl', // Poland
  'pt/pt', // Portugal
  'qa/en', // Qatar
  'ro/ro', // Romania
  'ru/ru', // Russia
  'se/sv', // Sweden
  'sk/sk', // Slovakia
  'th/th', // Thailand
  'us/en' // USA
];

var allStores = [];

everyLimit(countryCodes, 10, function(countryCode, done) {
  getStores(countryCode, productId, function(err, stores) {
    if (err) {
      console.error('-------> Error retreiving stores for "%s"', countryCode, err);
      return done(err, null);
    }

    Object.keys(stores).forEach(function(id) {
      var store = {
        id: id,
        name: stores[id],
        countryCode: countryCode.substr(0,2)
      };
      allStores.push(store);
    });


    i += Object.keys(stores).length;
    // console.log(countryCode.toUpperCase() + ' (%d stores)', Object.keys(stores).length);
    // console.log(stores);
    // console.log('Stores in total so far: %d', i);
    return done(err, stores);
  });
}, function(err, success) {
  if (err) {
    throw err;
  }
  var fs = require('fs');
  fs.writeFileSync('data.json', JSON.stringify(allStores));
  console.log(allStores);
});
