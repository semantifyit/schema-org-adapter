/** @ignore
 * Returns a sorted Array of Arrays that have a schema.org vocabulary version as first entry, and it's release date as second entry. Latest is first in array.
 *
 * @param {object} releaseLog - the releaseLog object from the versionsFile of schema.org
 * @returns {Array<Array<string>>} - Array with sorted release Arrays -> [version, date]
 */
export function sortReleaseEntriesByDate(
  releaseLog: Record<string, string>
): [string, string][] {
  const versionEntries = Object.entries(releaseLog);
  return versionEntries.sort((a, b) => +new Date(b[1]) - +new Date(a[1]));
}
