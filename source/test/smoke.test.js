const { expect } = require('chai');

const IOWS2 = require('../lib/iows2');
const IngkaApi = require('../lib/ingka');
const stores = require('../lib/stores');

describe('smoke', function() {
  const countryCodes = stores.getCountryCodes();

  describe('iows', function() {
    countryCodes.forEach((countryCode) => {
      it(`${countryCode}`, async function() {
        const client = new IOWS2(countryCode);
        const buCode = stores.findByCountryCode(countryCode)[0].buCode;
        const productId = '80213074';
        let availability = await client.getStoreProductAvailability(buCode, productId);
        expect(availability).to.be.an('object');
        expect(availability).to.have.property('probability');
        expect(availability).to.have.property('stock');
      });
    });
  });

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
