const { expect } = require('chai');

const IngkaApi = require('../lib/ingka');
const stores = require('../lib/stores');

describe.skip('smoke', function() {
  const countryCodes = stores.getCountryCodes();

  describe('inkga', function() {
    countryCodes.forEach((countryCode) => {
      it(`${countryCode}`, async function() {
        const client = new IngkaApi();
        const productId = '80213074';
        let response = await client.getAvailabilities(countryCode, productId);
        expect(response).to.have.property('status', 200);
        expect(response.data.data.length).to.be.greaterThan(0);
      });
    });
  });
});
