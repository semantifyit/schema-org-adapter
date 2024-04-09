/** @ignore
 * Checks if the given input is a boolean
 *
 * @param {any} value - the input element to check
 * @returns {boolean} true if the given input is a boolean value
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean"
}
