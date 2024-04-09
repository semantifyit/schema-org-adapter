import { isString } from "./isString";

/** @ignore
 * Checks if the given input is a JS array of strings
 *
 * @param {any} value - the input element to check
 * @returns {boolean} true if the given input is a JS array of strings
 */
export function isArrayOfStrings(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(v => isString(v));
}
