export type Store = {
    /**
     * - unique ikea store identification number
     */
    buCode: string;
    /**
     * - The name of the store, like "Augsburg",
     * "Bratislava" or similar, also unique worldwide
     */
    name: string;
    /**
     * lowercase two-letter country code following (ISO-3166)
     */
    countryCode: number;
};
/**
 * @typedef {Object} Store
 * @property {string} buCode - unique ikea store identification number
 * @property {string} name - The name of the store, like "Augsburg",
 *   "Bratislava" or similar, also unique worldwide
 * @property {number} countryCode lowercase two-letter country code following (ISO-3166)
 */
/**
 * @type {Array<Store>}
 */
export const data: Array<Store>;
export declare function findByQuery(query: string | RegExp, countryCode?: string): Store[];
export declare function findById(buCodes?: (string | number)[]): Store[];
export declare function findOneById(buCode: string | number): Store;
export declare function findByCountryCode(countryCode: string): Store[];
export declare function getCountryCodes(): string[];
export declare function getLanguageCode(countryCode: string): string;
//# sourceMappingURL=stores.d.ts.map