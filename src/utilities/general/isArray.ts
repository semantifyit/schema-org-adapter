/** @ignore
 * Checks if the given input is a JS array
 *
 * @param {any} value - the input element to check
 * @returns {boolean} true if the given input is a JS array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}
