import { isNil } from "./isNil";
import { isArray } from "./isArray";

/** @ignore
 * Checks if the given input is a JS object
 *
 * @param value - the input element to check
 * @returns true if the given input is a JS object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  if (isArray(value)) {
    return false;
  }
  if (isNil(value)) {
    return false;
  }
  return typeof value === "object";
}
