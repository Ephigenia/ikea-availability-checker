
import axios, { Axios, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { buCode, countryCode, findOneById, Store } from './stores';
import { IngkaNotFoundError, IngkaParseError, IngkaResponseError } from './ingkaErrors'
import { IngkaAvailabilitiesResponse } from './ingkaResponse';

// clientids taken from IKEA.tld websites they may change in the future
const CLIENT_ID_US = 'da465052-7912-43b2-82fa-9dc39cdccef8';
// const CLIENT_ID_IT = 'b6c117e5-ae61-4ef5-b4cc-e0b1e37f0631';
// const CLIENT_ID_NL = 'ac8b6bc1-b924-4bba-ba90-251610525145';

export interface ItemStockInfo {
  createdAt?: Date;
  probability?: PRODUCT_AVAILABILITY;
  buCode: string;
  productId: string;
  stock: number;
  store: Store;
  restockDate?: Date;
}

export enum PRODUCT_AVAILABILITY {
  HIGH_IN_STOCK = 'HIGH_IN_STOCK',
  LOW_IN_STOCK = 'LOW_IN_STOCK',
  OUT_IN_STOCK = 'OUT_IN_STOCK',
};

export const BASE_URL_DEFAULT = 'https://api.ingka.ikea.com';

const cache: Record<string, ItemStockInfo[]> = {};

export class IngkaApi {

  private client: AxiosInstance;

  constructor(
    clientId: string = CLIENT_ID_US,
    options: AxiosRequestConfig = {},
  ) {
    this.client = axios.create({
      timeout: 5000,
      baseURL: BASE_URL_DEFAULT,
      headers: {
        'x-client-id': clientId || CLIENT_ID_US,
        'accept': 'application/json;version=1'
      },
      ...options,
    });
  }

  parseAvailabilitiesResponse(
    responseData: IngkaAvailabilitiesResponse
  ): ItemStockInfo[] {
    // the INGKA API response can contain items which don’t belong to a store
    // but to general storage units or unknown things. We should filter
    // here just for items that list availabilities for a specific store
    // indicated by the "classUnitType" "STO".
    const itemsWithStores = responseData.data
      .filter(item =>item.classUnitKey?.classUnitType === 'STO')

    // filter for Items that have a "availableStocks" property
    const rawStockInfoItems = itemsWithStores.filter(item => item.availableStocks?.length);

    return rawStockInfoItems
      .map<ItemStockInfo>(item => {
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
            stockInfo.probability = probability.communication.messageType as PRODUCT_AVAILABILITY;
          }
          if(cashNCarry.restocks) {
            stockInfo.restockDate = new Date(cashNCarry.restocks[0].earliestDate);
          }
        }

        return stockInfo;
      });
  }

  // TODO add the ability to pass over arrays for buCode and itemCode
  async getStoreProductAvailability(
    countryCode: countryCode,
    productId: string,
    buCode: buCode,
  ): Promise<ItemStockInfo|undefined> {
    const key = countryCode + productId;
    if (!cache[key]) {
      cache[key] = await this.getAvailabilities(countryCode, [productId]);
    }
    return cache[key].find((item) => item.store?.buCode === buCode);
  }

  private handleAxiosError(err): void {
    if (err.response && err.response.status === 404) {
      throw new IngkaNotFoundError('Not Found', err);
    }
    throw new IngkaResponseError('Response Error', err);
  }

  private handleResponseError(response: AxiosResponse): void {
    if (response.data?.errors) {
      if (response.data.errors[0].code === 404) {
        throw new IngkaNotFoundError(response.data.errors[0].message);
      }
      throw new IngkaParseError('Unknown INGKA API error', response.data);
    }
  }

  private validateResponseStructure(data: IngkaAvailabilitiesResponse): boolean {
    if (
      !data ||
      !data.data ||
      !Array.isArray(data.data) ||
      !data.data.every(obj => typeof obj === 'object')
    ) {
      throw new IngkaParseError(`Unexpected response data structure detected`, data);
    }
    return true;
  }

  buildAvailabilityUri(countryCode: countryCode): string {
    return `cia/availabilities/ru/${countryCode}`;
  }

  async getAvailabilities(
    /** a single supported country code */
    countryCode: countryCode,
    /** one or multiple ikea article ids */
    itemNos: string[]|string,
    /** value of expand parameter */
    expand: string[] = ['StoresList', 'Restocks'],
    /** optional additional request configuration settings */
    options: AxiosRequestConfig = {}
  ): Promise<ItemStockInfo[]> {
    const uri = this.buildAvailabilityUri(countryCode);

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
      this.handleAxiosError(err);
    }
    this.handleResponseError(response);
    this.validateResponseStructure(response.data);
    return this.parseAvailabilitiesResponse(response.data);
  }
}
