/** @ignore
 * Returns the jsonld filename that holds the schema.org vocabulary for a given version.
 *
 * @param  version - the schema.org version
 * @param  [schemaHttps = true] - use https as protocol for the schema.org vocabulary - works only from version 9.0 upwards
 * @returns - the corresponding jsonld filename
 */
export function getFileNameForSchemaOrgVersion(
  version: string,
  schemaHttps = true
): string {
  // JSON-LD vocabulary files were available from version 3.1 on
  if (!(Number(version) > 3.0)) {
    throw new Error(
      "There is no jsonld file for the wanted schema.org version " + version
    );
  }
  // JSON-LD https vocabulary files were available from version 9.0 on
  // we could throw an error if schemaHttps is required as true, but this could introduce a new bug for already existing code, since https is the default option and probably used a lot
  if (!(Number(version) > 8.0)) {
    return "all-layers.jsonld";
  }
  if (schemaHttps) {
    return "schemaorg-all-https.jsonld";
  }
  return "schemaorg-all-http.jsonld";
}
