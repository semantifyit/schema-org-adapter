import {
  Context,
  ContextWord,
  LanguageObjectVocab,
  VersionsFile,
} from "./types";
import axios from "axios";
import { RetrievalMemory } from "./RetrievalMemory";

const myRetrievalMemory = RetrievalMemory.getInstance();

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

/** @ignore
 * Checks if the given input is a JS object
 *
 * @param value - the input element to check
 * @returns true if the given input is a JS object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  if (Array.isArray(value)) {
    return false;
  }
  if (isNil(value)) {
    return false;
  }
  return typeof value === "object";
}

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

/** @ignore
 * Checks if the given input is undefined or null
 *
 * @param {any} value - the input element to check
 * @returns {boolean} true if the given input is undefined or null
 */
export function isNil(value: unknown): value is null | undefined {
  return value === undefined || value === null;
}

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

/** @ignore
 * Checks if the given input is a JS array
 *
 * @param {any} value - the input element to check
 * @returns {boolean} true if the given input is a JS array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/** @ignore
 * Removes duplicates from a given Array (the array should have the same kind of elements)
 *
 * @param {Array} array - the input array
 * @returns {Array} the input array without duplicates
 */
export function uniquifyArray<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/*
term - A term is a short word defined in a context that MAY be expanded to an IRI
compact IRI - A compact IRI has the form of prefix:suffix and is used as a way of expressing an IRI without needing to define separate term definitions for each IRI contained within a common vocabulary identified by prefix.
prefix - A prefix is the first component of a compact IRI which comes from a term that maps to a string that, when prepended to the suffix of the compact IRI results in an absolute IRI. */

/** @ignore
 * Returns the compact IRI from a given absolute IRI and a corresponding context. If the context does not contain the used namespace, then 'null' is returned
 *
 * @param absoluteIRI - the absolute IRI to transform
 * @param context - the context object holding key-value pairs that represent indicator-namespace pairs
 * @param [equateVocabularyProtocols = false] - treats namespaces as equal even if their protocols (http/https) are different, it defaults to false.
 * @returns the compact IRI (null, if given context does not contain the used namespace)
 */
export function toCompactIRI(
  absoluteIRI: string,
  context: Context,
  equateVocabularyProtocols = false
): string | null {
  for (const contextTerm of Object.keys(context)) {
    const vocabIRI = context[contextTerm];
    if (isString(vocabIRI) && absoluteIRI.startsWith(vocabIRI as string)) {
      return (
        contextTerm + ":" + absoluteIRI.substring((vocabIRI as string).length)
      );
    }
    if (equateVocabularyProtocols && isString(vocabIRI)) {
      const protocolSwitchedIRI = switchIRIProtocol(vocabIRI as string);
      if (absoluteIRI.startsWith(protocolSwitchedIRI)) {
        return (
          contextTerm + ":" + absoluteIRI.substring(protocolSwitchedIRI.length)
        );
      }
    }
  }
  throw new Error(
    "Trying to get a compact IRI for a term with no entry in the Context"
  );
}

/** @ignore
 * Returns the absolute IRI from a given compact IRI and a corresponding context. If the context does not contain the used namespace, then 'null' is returned
 *
 * @param compactIRI - the compact IRI to transform
 * @param  context - the context object holding key-value pairs that represent indicator-namespace pairs
 * @returns {?string} the absolute IRI (null, if given context does not contain the used namespace)
 */
export function toAbsoluteIRI(compactIRI: string, context: Context): string {
  const terms = Object.keys(context);
  for (let i = 0; i < terms.length; i++) {
    const vocabIRI = context[terms[i]] as ContextWord;
    if (compactIRI.substring(0, compactIRI.indexOf(":")) === terms[i]) {
      return vocabIRI.concat(compactIRI.substring(compactIRI.indexOf(":") + 1));
    }
  }
  throw new Error(
    "Trying to get an absolute IRI for a term with no entry in the Context"
  );
}

/** @ignore
 * Returns a sorted Array of Arrays that have a schema.org vocabulary version as first entry and it's release date as second entry. Latest is first in array.
 *
 * @param {object} releaseLog - the releaseLog object from the versionsFile of schema.org
 * @returns {Array} - Array with sorted release Arrays -> [version, date]
 */
export function sortReleaseEntriesByDate(releaseLog: Record<string, string>) {
  const versionEntries = Object.entries(releaseLog);
  return versionEntries.sort((a, b) => +new Date(b[1]) - +new Date(a[1]));
}

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
  switch (version) {
    case "2.0":
    case "2.1":
    case "2.2":
    case "3.0":
      throw new Error("There is no jsonld file for that schema.org version.");
    case "3.1":
    case "3.2":
    case "3.3":
    case "3.4":
    case "3.5":
    case "3.6":
    case "3.7":
    case "3.8":
    case "3.9":
    case "4.0":
    case "5.0":
    case "6.0":
    case "7.0":
    case "7.01":
    case "7.02":
    case "7.03":
    case "7.04":
    case "8.0":
      return "all-layers.jsonld";
    case "9.0":
      if (schemaHttps) {
        return "schemaorg-all-https.jsonld";
      } else {
        return "schemaorg-all-http.jsonld";
      }
    default:
      // this is expected for newer releases that are not covered yet
      if (schemaHttps) {
        return "schemaorg-all-https.jsonld";
      } else {
        return "schemaorg-all-http.jsonld";
      }
  }
}

/** @ignore
 * Returns the given absolute IRI, but with the opposite protocol (http vs. https)
 *
 * @param  {string}IRI - the IRI that should be transformed
 * @returns {string} - the resulting transformed IRI
 */
export function switchIRIProtocol(IRI: string) {
  if (IRI.startsWith("https://")) {
    return "http" + IRI.substring(5);
  } else if (IRI.startsWith("http://")) {
    return "https" + IRI.substring(4);
  }
  return IRI;
}

/** @ignore */
export const toArray = <T>(o: T | T[]): T[] => (Array.isArray(o) ? o : [o]);

const URI_SEMANTIFY_GITHUB =
  "https://raw.githubusercontent.com/semantifyit/schemaorg/main";
const URI_SCHEMA_ORG_GITHUB =
  "https://raw.githubusercontent.com/schemaorg/schemaorg/";

/** @ignore
 * Returns the base part of respective release URI
 *
 * @returns The base part of respective release URI
 */
export function getURLBaseSchema(commitBase?: string) {
  const path = "/data/releases/";
  if (commitBase) {
    return URI_SCHEMA_ORG_GITHUB + commitBase + path;
  } else {
    return URI_SEMANTIFY_GITHUB + path;
  }
}

/** @ignore
 * Returns the URI of the respective versions file (from github - schema.org or schema org adapter fork)
 *
 * @param  {string?} commitBase - the commit of the schema.org repository to use
 * @returns The URI of the respective versions file
 */
export function getURLSchemaVersions(commitBase?: string) {
  const path = "/versions.json";
  if (commitBase) {
    return URI_SCHEMA_ORG_GITHUB + commitBase + path;
  } else {
    return URI_SEMANTIFY_GITHUB + path;
  }
}

/**
 * Creates a URL pointing to the Schema.org vocabulary for the wished version. This URL can then be added to the SDOAdapter to retrieve the Schema.org vocabulary.
 * The Schema.org version listing at https://raw.githubusercontent.com/schemaorg/schemaorg/main/versions.json is used for this function. Check https://schema.org/docs/developers.html for more information.
 * The internal cache is used for this function. If you want to reset the cache, use the function {@link fetchSchemaVersions | .fetchSchemaVersions()}.
 *
 * @example
 * ```JS
 * const { SOA } = require("schema-org-adapter");
 * const schemaUrl = await SOA.constructURLSchemaVocabulary("13.0");
 * // creates following URL pointing to the schema.org vocabulary version 13.0
 * "https://raw.githubusercontent.com/semantifyit/schemaorg/main/data/releases/13.0/schemaorg-all-https.jsonld"
 * ```
 *
 * @param version - The wished Schema.org vocabulary version for the resulting URL (e.g. "5.0", "3.7", or "latest"). default: "latest"
 * @param schemaHttps - Enables the use of the https version of the schema.org vocabulary. Only available for schema.org version 9.0 upwards. (default = true)
 * @param commit - The commit string from https://github.com/schemaorg/schemaorg which is taken as source (if not given, the latest commit of our fork at https://github.com/semantifyit/schemaorg is taken). Use this parameter only if you want to change the schema.org repository used as source for the URL generation. By standard, SDO Adapter uses a fork of the schema.org repository, which is updated only when schema.org releases a new vocabulary version, and that version passes all tests of SDO Adapter.
 * @returns The URL to the Schema.org vocabulary
 */
export async function constructURLSchemaVocabulary(
  version = "latest",
  schemaHttps = true,
  commit?: string
) {
  if (version === "latest") {
    version = await getLatestSchemaVersion(commit);
  }
  const fileName = getFileNameForSchemaOrgVersion(version, schemaHttps); // This can throw an error if the version is <= 3.0
  return getURLBaseSchema(commit) + version + "/" + fileName;
  // e.g. "https://raw.githubusercontent.com/schemaorg/schemaorg/main/data/releases/3.9/all-layers.jsonld";
}

/**
 * Returns the [schema.org version file](https://raw.githubusercontent.com/schemaorg/schemaorg/main/versions.json), which is fetched once and then saved in local cache.
 * Also sends head-requests to determine if the 'latest' schema.org version is really 'fetch-able'.
 * If not, this head-requests are done again for older versions until the latest valid version is determined and saved in the cache.
 * It is possible to reset the cache with the parameter **cacheClear**.
 *
 * @example
 * ```JS
 * const { SOA } = require("schema-org-adapter");
 *
 * // version file needed for the first time -> the file is fetched and then saved in cache
 * let schemaVersions = await SOA.fetchSchemaVersions();
 *
 * // version file already in cache -> no fetching needed
 * schemaVersions = await SOA.fetchSchemaVersions();
 *
 * // passing cacheClear = true -> the file is fetched and then saved in cache again
 * schemaVersions = await SOA.fetchSchemaVersions(true);
 * ```
 *
 * @param cacheClear - If true, delete the local cache of the version file and retrieve it again. (default = false)
 * @param commit - The commit string from https://github.com/schemaorg/schemaorg which is taken as source (if not given, the latest commit of our fork at https://github.com/semantifyit/schemaorg is taken). Use this parameter only if you want to change the schema.org repository used as source for the schema versions file. By standard, SDO Adapter uses a fork of the schema.org repository, which is updated only when schema.org releases a new vocabulary version, and that version passes all tests of SDO Adapter.
 * @returns The version file as JSON object
 */
export async function fetchSchemaVersions(
  cacheClear = false,
  commit?: string
): Promise<VersionsFile> {
  let versionFile;
  // 0. cache handling
  if (cacheClear) {
    // clear cache
    myRetrievalMemory.deleteCache();
  } else {
    // check if we already have a cached version
    const cachedData = myRetrievalMemory.getData("versionsFile", commit);
    if (cachedData) {
      return cachedData as VersionsFile;
    }
  }
  // 1. retrieve versions file
  const urlSchemaVersions = getURLSchemaVersions(commit);
  try {
    versionFile = await axios.get(urlSchemaVersions);
  } catch (e) {
    throw new Error(
      "Unable to retrieve the schema.org versions file at " + urlSchemaVersions
    );
  }
  if (!versionFile || !versionFile.data || !versionFile.data.releaseLog) {
    throw new Error(
      "The schema.org versions file at " +
        urlSchemaVersions +
        " returned an unexpected result."
    );
  }
  // 2. determine the latest valid version
  const schemaVersions = versionFile.data as VersionsFile;
  myRetrievalMemory.setData("versionsFile", schemaVersions, commit);
  let latestVersion;
  if (
    schemaVersions.schemaversion &&
    (await checkURL(
      await constructURLSchemaVocabulary(
        schemaVersions.schemaversion,
        true,
        commit
      )
    ))
  ) {
    latestVersion = schemaVersions.schemaversion;
  } else {
    // If the version stated as latest by schema.org doesn't exist, then try the other versions given in the release log until we find a valid one
    const sortedArray = sortReleaseEntriesByDate(schemaVersions.releaseLog);
    // Sort release entries by the date. latest is first in array
    for (const currVersion of sortedArray) {
      if (
        await checkURL(
          await constructURLSchemaVocabulary(currVersion[0], true, commit)
        )
      ) {
        latestVersion = currVersion[0];
        break;
      }
    }
  }
  if (!latestVersion) {
    throw new Error(
      'Could not find any valid vocabulary file in the schema.org versions to be declared as "latest".'
    );
  }
  myRetrievalMemory.setData("latest", latestVersion, commit);
  return schemaVersions;
}

/** @ignore
 * Sends a head-request to the given URL, checking if content exists.
 *
 * @param url - the URL to check
 * @returns Returns true if there is content
 */
export async function checkURL(url: string) {
  try {
    await axios.head(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Returns the latest version identifier for the schema.org vocabulary. The internal cache is used for this function. If you want to reset the cache, use the function {@link fetchSchemaVersions | .fetchSchemaVersions()}.
 *
 * @example
 * ```JS
 * const { SOA } = require("schema-org-adapter");
 * const latestSchemaVersion = await SOA.getLatestSchemaVersion();
 * // get the latest schema.org vocabulary version identifier
 * "13.0"
 * ```
 *
 * @param commit - The commit string from https://github.com/schemaorg/schemaorg which is taken as source (if not given, the latest commit of our fork at https://github.com/semantifyit/schemaorg is taken). Use this parameter only if you want to change the schema.org repository used as source for the schema versions file. By standard, SDO Adapter uses a fork of the schema.org repository, which is updated only when schema.org releases a new vocabulary version, and that version passes all tests of SDO Adapter.
 * @returns The latest version of the schema.org vocabulary
 */
export async function getLatestSchemaVersion(commit?: string) {
  let latestVersion = myRetrievalMemory.getData("latest", commit);
  if (!latestVersion) {
    // retrieve versions file if needed (checks for latest and valid version)
    await fetchSchemaVersions(false, commit);
  }
  latestVersion = myRetrievalMemory.getData("latest", commit);
  if (latestVersion) {
    return latestVersion as string;
  } else {
    throw new Error(
      "Could not identify the latest version of the schema.org vocabulary"
    );
  }
}
