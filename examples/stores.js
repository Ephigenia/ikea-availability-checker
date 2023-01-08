/**
 * Example showing how to get all stores from a country
 *
 *     node stores.js AT
 */

const ikea = require('../dist/src');
const args = process.argv.slice(2);

const [countryCode] = args;
const result = ikea.stores.findByCountryCode(countryCode);
process.stdout.write(JSON.stringify(result));
