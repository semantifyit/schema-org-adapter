import { VersionsFile } from "../types/types";
import { RetrievalMemory } from "../utilities/infrastructure/RetrievalMemory";
import { getFileNameForSchemaOrgVersion } from "../utilities/infrastructure/getFileNameForSchemaOrgVersion";
import { checkIfUrlExists } from "../utilities/infrastructure/checkIfUrlExists";
import axios from "axios";
import { sortReleaseEntriesByDate } from "../utilities/infrastructure/sortReleaseEntriesByDate";
import { getGitHubBaseURL } from "../utilities/infrastructure/getGitHubBaseURL";

const myRetrievalMemory = RetrievalMemory.getInstance();

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
export async function constructURLSchemaVocabulary(version = "latest", schemaHttps = true, commit?: string) {
  if (version === "latest") {
    version = await getLatestSchemaVersion(commit);
  }
  const fileName = getFileNameForSchemaOrgVersion(version, schemaHttps); // This can throw an error
  return getGitHubBaseURL(commit) + "/data/releases/" + version + "/" + fileName;
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
export async function fetchSchemaVersions(cacheClear = false, commit?: string): Promise<VersionsFile> {
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
  const urlSchemaVersions = getGitHubBaseURL(commit) + "/versions.json";
  try {
    versionFile = await axios.get(urlSchemaVersions);
  } catch (e) {
    throw new Error("Unable to retrieve the schema.org versions file at " + urlSchemaVersions);
  }
  if (!versionFile || !versionFile.data || !versionFile.data.releaseLog) {
    throw new Error("The schema.org versions file at " + urlSchemaVersions + " returned an unexpected result.");
  }
  // 2. determine the latest valid version
  const schemaVersions = versionFile.data as VersionsFile;
  myRetrievalMemory.setData("versionsFile", schemaVersions, commit);
  let latestVersion;
  if (
    schemaVersions.schemaversion &&
    (await checkIfUrlExists(await constructURLSchemaVocabulary(schemaVersions.schemaversion, true, commit)))
  ) {
    latestVersion = schemaVersions.schemaversion;
  } else {
    // If the version stated as latest by schema.org doesn't exist, then try the other versions given in the release log until we find a valid one
    const sortedArray = sortReleaseEntriesByDate(schemaVersions.releaseLog);
    // Sort release entries by the date. latest is first in array
    for (const currVersion of sortedArray) {
      if (await checkIfUrlExists(await constructURLSchemaVocabulary(currVersion[0], true, commit))) {
        latestVersion = currVersion[0];
        break;
      }
    }
  }
  if (!latestVersion) {
    throw new Error('Could not find any valid vocabulary file in the schema.org versions to be declared as "latest".');
  }
  myRetrievalMemory.setData("latest", latestVersion, commit);
  return schemaVersions;
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
    throw new Error("Could not identify the latest version of the schema.org vocabulary");
  }
}
