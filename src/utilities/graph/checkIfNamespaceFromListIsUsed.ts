import { isObject } from "../general/isObject";
import { isString } from "../general/isString";

/** @ignore
 * Checks if the value includes an absolute IRI that is present in the given namespaceArray. If so, that match is added to the given result Set.
 *
 * @param value - the value to check, is expected to be either an array, an object, or a string.
 * @param namespaceArray - an array of IRIs to search for
 * @param result - a Set to save the found matches
 */
export function checkIfNamespaceFromListIsUsed(
  value: string | object | (string | object)[],
  namespaceArray: string[],
  result: Set<string>
): void {
  if (Array.isArray(value)) {
    value.forEach(function (val) {
      checkIfNamespaceFromListIsUsed(val, namespaceArray, result);
    });
  } else {
    let toCheck: string;
    // todo this could be refactored? what if toCheck is either a string or an @id object? use types
    if (isObject(value) && isString(value["@id"])) {
      toCheck = value["@id"];
    } else {
      // } else if (isString(value)) {
      toCheck = value as string;
    }
    if (isString(toCheck) && toCheck.startsWith("http")) {
      const match = namespaceArray.find((el) => toCheck.startsWith(el));
      if (match && !result.has(match)) {
        result.add(match);
      }
    }
  }
}
