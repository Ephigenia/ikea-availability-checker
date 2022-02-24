export = IOWS2;
/**
 * @class IOWS2
 */
declare class IOWS2 {
    /**
     * @param {object} data plain iows endpoint response data object
     * @returns {ProductAvailability} transformed stock information
     */
    static parseAvailabilityFromResponseData(data: object): ProductAvailability;
    /**
     * @param {string} countryCode - required ISO 3166-1 alpha-2 country code
     * @param {string} [languageCode=''] - optional ISO 3166-1 alpha-2 country code
     * @param {import('axios').AxiosRequestConfig} options optional default axios
     *   options
     */
    constructor(countryCode: string, languageCode?: string, options?: import('axios').AxiosRequestConfig);
    /** @type {string} normalized two-letter country code */
    countryCode: string;
    /** @type {string} normalized two-letter language code */
    languageCode: string;
    /** @type {string} base URL to the iows api endpoint */
    baseUrl: string;
    api: any;
    /**
     * @param {string} url required request url
     * @param {import('axios').AxiosRequestConfig} [options={}] additional
     *   options
     * @return {Promise<Object>} response body data
     * @throws {import('./errors').IOWS2ParseError} in case the response
     *   body is not an object
     * @throws {import('./errors').IOWS2NotFoundError} in case the response
     *   status code is 404
     * @throws {import('./errors').IOWS2DeprecatedError} in case the response
     *   contains a "deprecation" header
     * @throws {import('./errors').IOWS2ResponseError} in any other case
     */
    fetch(url: string, options?: import('axios').AxiosRequestConfig): Promise<any>;
    buildUrl(baseUrl: any, countryCode: any, languageCode: any, buCode: any, productId: any, productType?: string): string;
    /**
     * @param {string} productId
     * @returns {string}
     */
    normalizeProductId(productId: string): string;
    /**
     * Normalize the buCode
     *
     * Note that the buCode "003" must keep the zeros
     *
     * @param {string} buCode
     * @returns {string}
     */
    normalizeBuCode(buCode: string): string;
    /**
     * Asynchronsouly request the stock information of a specific product in
     * the given store.
     *
     * @param {string} buCode 3-digit ikea store identification number
     * @param {string|number} productId ikea product identification number
     * @param {PRODUCT_TYPE} [productType=PRODUCT_TYPE.ART] optional different
     *   product type. The product type is guessed from the product ID.
     * @returns {Promise<ProductAvailability>} resulting product stock
     *   information
     */
    getStoreProductAvailability(buCode: string, productId: string | number, productType?: {
        ART: string;
        SPR: string;
    }): Promise<ProductAvailability>;
}
declare namespace IOWS2 {
    export { ProductAvailabilityProbability, ProductAvailabilityForecastItem, ProductAvailability };
}
type ProductAvailability = {
    /**
     * instance of a javascript date of the moment when
     * the data was created.
     */
    createdAt: Date;
    /**
     *   probability of the product beeing in store ("LOW", "MEDIUM" or "HIGH")
     */
    probability: ProductAvailabilityProbability;
    /**
     *   ikea product identification number
     */
    productId: string;
    /**
     *   ikea store identification number
     */
    buCode: string;
    /**
     *   number of items currently in stock
     */
    stock: number;
    /**
     * when available a list of items indicating the estimated stock amount in the
     * next days
     */
    forecast?: ProductAvailabilityForecastItem[];
    /**
     * Estimated date when the item gets restocked. Can be empty
     */
    restockDate?: Date;
};
type ProductAvailabilityProbability = ('LOW' | 'MEDIUM' | 'HIGH');
type ProductAvailabilityForecastItem = {
    /**
     *   instance of a date for which the estimation is made
     */
    date: Date;
    /**
     *   estimated number of items in stock on the forecasted date
     */
    stock: number;
    /**
     *   probability of the product beeing in store ("LOW", "MEDIUM" or "HIGH")
     */
    probability: ProductAvailabilityProbability;
};
//# sourceMappingURL=iows2.d.ts.map