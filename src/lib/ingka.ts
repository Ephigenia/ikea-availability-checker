import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  isAxiosError
} from "axios";

import { buCode, countryCode, findOneById, Store } from "./stores";
import {
  IngkaHttpError,
  IngkaParseError,
  IngkaResponseError,
} from "./ingkaErrors";
import { IngkaAvailabilitiesErrorResponse, IngkaAvailabilitiesResponse } from "./ingkaResponse";

// clientids taken from IKEA.tld websites they may change in the future
const CLIENT_ID_US = "da465052-7912-43b2-82fa-9dc39cdccef8";
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
  HIGH_IN_STOCK = "HIGH_IN_STOCK",
  LOW_IN_STOCK = "LOW_IN_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

export const BASE_URL_DEFAULT = "https://api.ingka.ikea.com";

export class IngkaApi {

  public client: AxiosInstance;

  constructor(
    clientId: string = CLIENT_ID_US,
    options: AxiosRequestConfig = {}
  ) {
    this.client = axios.create({
      timeout: 5000,
      baseURL: BASE_URL_DEFAULT,
      headers: {
        "x-client-id": clientId || CLIENT_ID_US,
        accept: "application/json;version=1",
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
    const itemsWithStores = responseData.data.filter(
      (item) => item.classUnitKey?.classUnitType === "STO"
    );

    // filter for Items that have a "availableStocks" property
    const rawStockInfoItems = itemsWithStores
      .filter((item) => item.availableStocks?.length)
      .filter((item) => findOneById(item.classUnitKey.classUnitCode));

    // remove all stores which are not known
    return rawStockInfoItems.map<ItemStockInfo>((item) => {
      const stockInfo: ItemStockInfo = {
        buCode: item.classUnitKey.classUnitCode,
        productId: item.itemKey.itemNo,
        stock: 0,
        store: findOneById(item.classUnitKey.classUnitCode) as Store,
      };

      const cashNCarry = (item.availableStocks || []).find(
        (item) => item.type === "CASHCARRY"
      );

      if (cashNCarry) {
        stockInfo.stock = parseInt(String(cashNCarry.quantity), 10);
        stockInfo.createdAt = new Date(cashNCarry.updateDateTime);

        const probability = (cashNCarry.probabilities || []).find(
          (item) => item.communication && item.communication.messageType
        );
        if (probability) {
          stockInfo.probability = probability.communication
            .messageType as PRODUCT_AVAILABILITY;
        }
        if (cashNCarry.restocks) {
          stockInfo.restockDate = new Date(cashNCarry.restocks[0].earliestDate);
        }
      }

      return stockInfo;
    });
  }

  cache: Map<string, Promise<ItemStockInfo[]>> = new Map();

  async getStoreProductAvailability(
    countryCode: countryCode,
    productId: string,
    buCode: buCode
  ): Promise<ItemStockInfo | undefined> {
    const key = countryCode + productId;
    if (!this.cache.has(key)) {
      this.cache.set(key, this.getAvailabilities(countryCode, [productId]));
    }
    return this.cache.get(key)?.then(arr => arr.find(item => item.store?.buCode === buCode));
  }

  private handleResponseError(response: AxiosResponse): void {
    if (!response.data.errors?.length) return;
    const message = (response.data?.errors || [])[0]?.message || 'Unknown response error';
    throw new IngkaResponseError(message, response);
  }

  private validateResponseStructure(
    data: IngkaAvailabilitiesResponse
  ): boolean {
    if (
      !data ||
      !data.data ||
      !Array.isArray(data.data) ||
      !data.data.every((obj) => typeof obj === "object")
    ) {
      throw new IngkaParseError(
        `Unexpected response data structure detected`,
        data
      );
    }
    return true;
  }

  buildAvailabilityUri(countryCode: countryCode, unitType = 'ru'): string {
    return `cia/availabilities/${unitType}/${countryCode}`;
  }

  async getAvailabilities(
    /** a single supported country code */
    countryCode: countryCode,
    /** one or multiple ikea article ids */
    itemNos: string[] | string,
    /** value of expand parameter */
    expand: string[] = ["StoresList", "Restocks"],
    /** optional additional request configuration settings */
    options: AxiosRequestConfig = {}
  ): Promise<ItemStockInfo[]> {
    const uri = this.buildAvailabilityUri(countryCode);
    options = options || {};
    options.params = {
      // StoresList,Restocks,SalesLocations
      expand: (expand || ["StoresList", "Restocks"]).join(","),
      itemNos: (Array.isArray(itemNos) ? itemNos : [itemNos]).join(","),
      ...(options.params || {}),
    };

    return this.client.get<IngkaAvailabilitiesResponse>(uri, options)
      .then(response => {
        this.handleResponseError(response);
        this.validateResponseStructure(response.data);
        return this.parseAvailabilitiesResponse(response.data);
      })
      .catch((err: AxiosError<IngkaAvailabilitiesErrorResponse>) => {
        if (isAxiosError(err)) {
          const message = err.response?.data.message || 'Unknown Response error';
          throw new IngkaHttpError(message, err);
        }
        throw err;
      });
  }
}
