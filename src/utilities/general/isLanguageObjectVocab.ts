import { isString } from "./isString";
import { isObject } from "./isObject";
import { LanguageObjectVocab } from "../../types/types";

/** @ignore
 * Check is the given input is a language input object, hence, an object with @language and @value
 *
 * @param value - the input element to check
 * @returns true if the given input is a language input object
 */
export function isLanguageObjectVocab(
  value: unknown
): value is LanguageObjectVocab {
  if (isObject(value)) {
    if (isString(value["@language"]) && isString(value["@value"])) {
      return true;
    }
  }
  return false;
}
