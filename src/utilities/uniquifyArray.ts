/** @ignore
 * Removes duplicates from a given Array (the array should have the same kind of elements)
 *
 * @param {Array} array - the input array
 * @returns {Array} the input array without duplicates
 */
export function uniquifyArray<T>(array: T[]): T[] {
  return [...new Set(array)];
}
