var fs = require('fs');
var path = require('path');
var csvparse = require('js-csvparser');

var buDataFilename = path.join(__dirname, 'data', 'buCodes.csv');
if (!fs.statSync(buDataFilename)) {
  throw new Error(
    'buCodes.csv data file not found: "' + buDataFilename + '"'
  );
}
var rawCsvContent = fs.readFileSync(buDataFilename, 'utf-8');

var parseOptions = {
  convertToTypes: {
    // keep zeros in front of buCodes
    convert: false
  },
  skipEmptyLines: true
}
var data = csvparse(rawCsvContent, parseOptions).data
  .map(function(row) {
    return {
      buCode: row[0],
      city: row[1],
      countryCode: row[2]
    }
  });

function lookup(buCode) {
  return data.find(function(item) {
    return item.buCode == buCode;
  });
};

module.exports = {
  lookup: lookup
};
