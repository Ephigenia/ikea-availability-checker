export = IngkaApi;
declare class IngkaApi {
    constructor(clientId?: string, options?: {});
    client: any;
    parseAvailabilitiesResponse(data: any): any;
    getStoreProductAvailability(buCode: any, itemCode: any): Promise<any>;
    /**
     * @param {string} countryCode a single supported country code
     * @param {string[]} itemNos one or multiple ikea article ids
     * @param {string[]} expand value of expand parameter
     * @returns {import('axios').AxiosResponse}
     */
    getAvailabilities(countryCode: string, itemNos: string[], expand?: string[]): import('axios').AxiosResponse;
}
declare namespace IngkaApi {
    export { IngkaProductAvailability };
}
type IngkaProductAvailability = {
    buCode: string;
    /**
     * instance of a javascript date of the moment when
     * the data was created.
     */
    createdAt: Date;
    /**
     *   probability of the product beeing in store ("LOW_IN_STOCK", "HIGH_IN_STOCK" or "OUT_OF_STOCK")
     */
    probability: string;
    /**
     *   ikea product identification number
     */
    productId: string;
    store: import('./stores').Store;
    /**
     *   number of items currently in stock
     */
    stock: number;
};
//# sourceMappingURL=ingka.d.ts.map