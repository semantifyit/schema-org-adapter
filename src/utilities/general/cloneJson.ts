/** @ignore
 * Creates a clone of the given JSON input (without reference to the original input)
 *
 * @param input - the JSON element that should be copied
 * @returns copy of the given JSON element
 */
export function cloneJson<T>(input: T): T {
  if (input === undefined) {
    return input;
  }
  return JSON.parse(JSON.stringify(input));
}
