/** @ignore
 * Checks if the given input is undefined or null
 *
 * @param {any} value - the input element to check
 * @returns {boolean} true if the given input is undefined or null
 */
export function isNil(value: unknown): value is null | undefined {
  return value === undefined || value === null;
}
