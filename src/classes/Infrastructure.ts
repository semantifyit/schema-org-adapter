import { VersionsFile, VersionsFileSemantify } from "../types/types";
import { RetrievalMemory } from "../utilities/infrastructure/RetrievalMemory";
import { getFileNameForSchemaOrgVersion } from "../utilities/infrastructure/getFileNameForSchemaOrgVersion";
import { checkIfUrlExists } from "../utilities/infrastructure/checkIfUrlExists";
import axios from "axios";
import { sortReleaseEntriesByDate } from "../utilities/infrastructure/sortReleaseEntriesByDate";
import { getGitHubBaseURL } from "../utilities/infrastructure/getGitHubBaseURL";
import { SEMANTIFY_COMMIT, SEMANTIFY_VERSION_FILE_URL } from "../data/semantify";

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
  if (commit === SEMANTIFY_COMMIT) {
    // we return here the hardcoded semantify URL, to not have to fetch the all-versions-file when it is not necessary
    // supporting only versions from 12.0 upwards
    if (!(Number(version) > 11.01)) {
      throw new Error(
        "There is no vocabulary file for the wanted schema.org version " + version + " hosted at semantify.it"
      );
    }
    return "https://semantify.it/voc/schema-" + version;
  } else {
    const fileName = getFileNameForSchemaOrgVersion(version, schemaHttps); // This can throw an error
    return getGitHubBaseURL(commit) + "/data/releases/" + version + "/" + fileName;
    // e.g. "https://raw.githubusercontent.com/schemaorg/schemaorg/main/data/releases/3.9/all-layers.jsonld";
  }
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
): Promise<VersionsFile | VersionsFileSemantify> {
  // 1. cache handling
  if (cacheClear) {
    // clear cache
    myRetrievalMemory.deleteCache();
  } else {
    // check if we already have a cached version
    const cachedData = myRetrievalMemory.getData("versionsFile", commit);
    if (cachedData && commit === SEMANTIFY_COMMIT) {
      return cachedData as VersionsFileSemantify;
    }
    if (cachedData) {
      return cachedData as VersionsFile;
    }
  }
  // 2. fetch versions file
  let versionFile: VersionsFile | VersionsFileSemantify;
  let latestVersion: string;
  if (commit !== SEMANTIFY_COMMIT) {
    // 2.a. fetch from GitHub
    const resGH = await getSchemaVersionsFromGithub(commit);
    latestVersion = resGH.latestVersion;
    versionFile = resGH.versionFile;
  } else {
    // 2.b. fetch from Semantify
    const resSem = await getSchemaVersionsFromSemantify();
    latestVersion = resSem.latestVersion;
    versionFile = resSem.versionFile;
  }
  // 3. save in cache and return versionFile
  myRetrievalMemory.setData("versionsFile", versionFile, commit);
  myRetrievalMemory.setData("latest", latestVersion, commit);
  return versionFile;
}

async function getSchemaVersionsFromGithub(commit?: string): Promise<{
  versionFile: VersionsFile;
  latestVersion: string;
}> {
  let versionFileRes;
  let latestVersion;
  // 1. retrieve versions file
  const urlSchemaVersions = getGitHubBaseURL(commit) + "/versions.json";
  try {
    versionFileRes = await axios.get(urlSchemaVersions);
  } catch (e) {
    throw new Error("Unable to retrieve the schema.org versions file at " + urlSchemaVersions);
  }
  if (!versionFileRes || !versionFileRes.data || !versionFileRes.data.releaseLog) {
    throw new Error("The schema.org versions file at " + urlSchemaVersions + " returned an unexpected result.");
  }
  // 2. determine the latest valid version
  const versionFile = versionFileRes.data as VersionsFile;
  if (
    versionFile.schemaversion &&
    (await checkIfUrlExists(await constructURLSchemaVocabulary(versionFile.schemaversion, true, commit)))
  ) {
    latestVersion = versionFile.schemaversion;
  } else {
    // If the version stated as latest by schema.org doesn't exist, then try the other versions given in the release log until we find a valid one
    const sortedArray = sortReleaseEntriesByDate(versionFile.releaseLog);
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
  return {
    versionFile,
    latestVersion
  };
}

async function getSchemaVersionsFromSemantify(): Promise<{
  versionFile: VersionsFileSemantify;
  latestVersion: string;
}> {
  let versionFileRes;
  // 1. retrieve versions file
  try {
    versionFileRes = await axios.get(SEMANTIFY_VERSION_FILE_URL);
  } catch (e) {
    throw new Error("Unable to retrieve the schema.org versions file at " + SEMANTIFY_VERSION_FILE_URL);
  }
  if (!versionFileRes || !versionFileRes.data || !versionFileRes.data.latest || !versionFileRes.data.all) {
    throw new Error(
      "The schema.org versions file at " + SEMANTIFY_VERSION_FILE_URL + " returned an unexpected result."
    );
  }
  // 2. determine the latest version (no need for validity check, since we know that Semantify will have only valid IRIs)
  const versionFile = versionFileRes.data as VersionsFileSemantify;
  const latestVersion = versionFile.latest.schemaVersion;
  if (!latestVersion) {
    throw new Error('Could not find any valid vocabulary file in the schema.org versions to be declared as "latest".');
  }
  return {
    versionFile,
    latestVersion
  };
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
