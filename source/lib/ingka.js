'use strict';

const axios = require('axios');

class IngkaApi {
  constructor(
    clientId = 'da465052-7912-43b2-82fa-9dc39cdccef8',
  ) {
    this.client = axios.create({
      timeout: 5000,
      baseURL: 'https://api.ingka.ikea.com',
      headers: {
        // api key taken from ikea.us
        'x-client-id': clientId,
      },
    });
  }

  /**
   * @param {string} countryCode
   * @param {string[]} itemCodes
   * @returns {import('axios').AxiosResponse}
   */
  getAvailabilities(countryCode, itemCodes) {
    const uri = `cia/availabilities/ru/${countryCode}`;
    const expand = ['StoresList', 'Restocks'];
    const options = {
      params: {
        expand: expand.join(','),
        itemNos: (Array.isArray(itemCodes) ? itemCodes : [itemCodes]).join(','),
      },
    };
    return this.client.get(uri, options);
  }
}

module.exports = IngkaApi;
