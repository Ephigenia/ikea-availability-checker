/**
 * Example showing how to retreive the availbility of a single product in
 * a single store.
 *
 *     node product-availability.js de 00501436
 */

const ikea = require('../dist/src');
const args = process.argv.slice(2);

(async function() {
  const [countryCode, productId] = args;
  const stores = ikea.stores.findByCountryCode(countryCode);
  const availabilities = await ikea.availabilities(stores, [productId]);

  process.stdout.write(JSON.stringify(availabilities));
})();
