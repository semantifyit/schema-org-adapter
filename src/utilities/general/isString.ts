import { isNil } from "./isNil";

/** @ignore
 * Checks if the given input is a string
 *
 * @param {any} value - the input element to check
 * @returns {boolean} true if the given input is a string
 */
export function isString(value: unknown): value is string {
  if (isNil(value)) {
    return false;
  }
  return typeof value === "string" || value instanceof String;
}
