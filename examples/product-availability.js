/**
 * Example showing how to retreive the availbility of a single product in
 * a single store.
 *
 *     node product-availability.js 394 00501436
 */

import ikea from './../source';

const args = process.argv.slice(2);

(async function() {
  const [storeId, productId] = args;
  const result = await ikea.availability(storeId, productId);

  console.log(result);
})();
