/**
 * Returns a function which when applied on a string colors the string in cli
 *
 * @param {number} val
 * @returns {function}
 */
export function availabilityColor(val: number): Function;
/**
 * Returns a function which when applied on a string colors the string in cli
 *
 * @param {import('../iows2').ProductAvailabilityProbability} val probability code
 * @returns {function}
 */
export function probabilityColor(val: import('../iows2').ProductAvailabilityProbability): Function;
export declare function createReport(data: any): string;
//# sourceMappingURL=stock-table.d.ts.map