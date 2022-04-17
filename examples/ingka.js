/**
 * Example showing how to retreive the availbility of a single product in
 * a single store.
 *
 *     node product-availability.js 394 00501436
 */

 const IngkaApi = require('../source/lib/ingka');
 const args = process.argv.slice(2);

(async function() {
  const [countyCode, productIds] = args;
  const api = new IngkaApi();
  const response = await api.getAvailabilities(countyCode, productIds.split(','));

  const parsed = response.data.data.map(item => {

    let stock = 0;
    if (item.availableStocks && item.availableStocks.length) {
      stock = parseInt(item.availableStocks[0].quantity, 10);
    }

    let buCode;
    if (
      item.classUnitKey &&
      item.classUnitKey.classUnitType &&
      item.classUnitKey.classUnitType === 'STO'
    ) {
      buCode = item.classUnitKey.classUnitCode
    }

    return {
      probability: 'UNKNOWN',
      stock,
      buCode,
    }
  }).filter(({ buCode }) => buCode);

  console.log(parsed);
})();
