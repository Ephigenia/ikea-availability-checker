
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { normalizeProductId } from '../cli/lib/helper';
import { findOneById, Store } from './stores';
import { IngkaNotFoundError, IngkaResponseError } from './ingkaErrors'
import { IngkaAvailabilitiesResponse } from './ingkaResponse';

// clientids taken from IKEA.tld websites
// they may change in the future
const CLIENT_ID_US = 'da465052-7912-43b2-82fa-9dc39cdccef8';
// const CLIENT_ID_IT = 'b6c117e5-ae61-4ef5-b4cc-e0b1e37f0631';
// const CLIENT_ID_BE = 'b6c117e5-ae61-4ef5-b4cc-e0b1e37f0631';
// const CLIENT_ID_NL = 'ac8b6bc1-b924-4bba-ba90-251610525145';

export interface ItemStockInfo {
  createdAt?: Date;
  probability?: string;
  buCode: string;
  productId: string;
  stock: number;
  store?: Store;
  restockDate?: Date;
}

const cache: Record<string, ItemStockInfo[]> = {};

export class IngkaApi {

  private client: AxiosInstance;

  constructor(
    clientId: string = CLIENT_ID_US,
    options: AxiosRequestConfig = {},
  ) {
    this.client = axios.create({
      timeout: 5000,
      baseURL: 'https://api.ingka.ikea.com',
      headers: {
        'x-client-id': clientId || CLIENT_ID_US,
      },
      ...options,
    })
  }

  parseAvailabilitiesResponse(
    responseData: IngkaAvailabilitiesResponse
  ): ItemStockInfo[] {
    const validItems = responseData.data
      // the ingka API response contains 2-3 items which don’t belong to a
      // specific store and can be filtered out
      .filter(item =>
        item.classUnitKey &&
        item.classUnitKey.classUnitType &&
        item.classUnitKey.classUnitType === 'STO'
      )
      .filter(item =>
        item.availableStocks &&
        item.availableStocks.length > 0
      );

    const tranformedItems = validItems
      .map(item => {
        const stockInfo: ItemStockInfo = {
          buCode: item.classUnitKey.classUnitCode,
          productId: item.itemKey.itemNo,
          stock: 0,
          store: findOneById(item.classUnitKey.classUnitCode) || undefined,
        };

        const cashNCarry = (item.availableStocks || [])
          .find(item => item.type === 'CASHCARRY');

        if (cashNCarry) {
          stockInfo.stock = parseInt(String(cashNCarry.quantity), 10);
          stockInfo.createdAt = new Date(cashNCarry.updateDateTime);

          const probability = (cashNCarry.probabilities || []).find(item => (
            item.communication && item.communication.messageType
          ));
          if (probability) {
            stockInfo.probability = probability.communication.messageType;
          }
          if(cashNCarry.restocks) {
            stockInfo.restockDate = new Date(cashNCarry.restocks[0].earliestDate);
          }
        }

        return stockInfo;
      });

    return tranformedItems;
  }

  // TODO add the ability to pass over arrays for buCode and itemCode
  async getStoreProductAvailability(
    countryCode: string,
    productId: string,
    buCode: string,
  ) {
    const key = countryCode + productId;
    if (!cache[key]) {
      cache[key] = await this.getAvailabilities(countryCode, [productId]);
    }
    return cache[key].find((item) => {
      return item.store?.buCode === buCode
    });
  }

  async getAvailabilities(
    /** a single supported country code */
    countryCode: string,
    /** one or multiple ikea article ids */
    itemNos: string[]|string,
    /** value of expand parameter */
    expand: string[] = ['StoresList', 'Restocks'],
    /** optional additional request configuration settings */
    options: AxiosRequestConfig = {}
  ): Promise<ItemStockInfo[]> {
    const uri = `cia/availabilities/ru/${countryCode}`;

    options = options || {};
    options.params = {
      // StoresList,Restocks,SalesLocations
      expand: (expand || ['StoresList', 'Restocks']).join(','),
      itemNos: (Array.isArray(itemNos) ? itemNos : [itemNos]).join(','),
      ...options.params || {}
    };

    let response;
    try {
      response = await this.client.get<IngkaAvailabilitiesResponse>(uri, options);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        throw new IngkaNotFoundError(err);
      }
      throw new IngkaResponseError(err);
    }

    // Ingka api replies with status 200 on invalid product codes
    if (response.data && response.data.errors) {
      if (response.data.errors[0].code === 404) {
        throw new IngkaNotFoundError(response);
      }
      throw new IngkaResponseError(response);
    }

    return this.parseAvailabilitiesResponse(response.data);
  }
}
