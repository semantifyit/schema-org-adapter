import { SOA } from "../src/index";
import {
  isObject,
  isString,
  getFileNameForSchemaOrgVersion,
  sortReleaseEntriesByDate,
  checkURL,
} from "../src/utilities";
import axios from "axios";
import { debugFunc, commit } from "./testUtility";

/**
 *  These tests check the retrieving of data from schema.org to ensure the correct functionality of vocabulary version determination and usage
 */
describe("Infrastructure testing", () => {
  // Check if the retrieval of the versionsFile from schema.org works.
  test("fetchSchemaVersions - file structure", async () => {
    const schemaVersions = await SOA.fetchSchemaVersions(false, commit);
    debugFunc(schemaVersions);
    expect(isObject(schemaVersions)).toBe(true);
    expect(isObject(schemaVersions?.releaseLog)).toBe(true);
    expect(isString(schemaVersions?.schemaversion)).toBe(true);
    expect(isString(await SOA.getLatestSchemaVersion(commit))).toBe(true);
  });

  // Check if the latest version found in the versionsFile is also the latest valid version elaborated by the schema-org-adapter adapter (schema-org-adapter only marks a version as valid if the corresponding vocabulary file exists)
  test("fetchSchemaVersions - latestVersionIsCorrect", async () => {
    const schemaVersions = await SOA.fetchSchemaVersions(false, commit);
    if (!schemaVersions) {
      throw new Error(
        "SOA.fetchSchemaVersions() for commit: " + commit + " not working."
      );
    }
    // Sort release entries by the date. latest is first in array
    const sortedVersionsArray = sortReleaseEntriesByDate(
      schemaVersions.releaseLog
    );
    const latestVersion = await SOA.getLatestSchemaVersion(commit);
    // Latest (first) element of Array must be the same as the latest version found by schema-org-adapter
    debugFunc("Latest version by versionsFile: " + sortedVersionsArray[0][0]);
    debugFunc("Latest version by schema-org-adapter: " + latestVersion);
    expect(sortedVersionsArray[0][0] === latestVersion).toBe(true);
    // Check if the latest version is also officially declared on the schema.org website - if error -> does not exist
    await axios.get(
      "https://github.com/schemaorg/schemaorg/tree/main/data/releases/" +
        sortedVersionsArray[0][0]
    );
  });

  // Checks if the version files returned from getFileNameForSchemaOrgVersion() really exist (if they can be fetched)
  test("fetchSchemaVersions - getAllVocabularyVersions", async () => {
    // 2.0 - 3.0 have no jsonld
    // 3.1 - 8.0 have all-layers.jsonld
    // 9.0 + have schemaorg-all-http.jsonld
    const schemaVersions = await SOA.fetchSchemaVersions(false, commit);
    if (!schemaVersions) {
      throw new Error(
        "SOA.fetchSchemaVersions() for commit: " + commit + " not working."
      );
    }
    for (const currentVersion of Object.keys(schemaVersions.releaseLog)) {
      try {
        getFileNameForSchemaOrgVersion(currentVersion);
      } catch (e) {
        // this version has no jsonld file, we skip it
        continue;
      }
      // let this function construct the URL. No error should happen.
      const currentFileURL = await SOA.constructURLSchemaVocabulary(
        currentVersion,
        true,
        commit
      );
      debugFunc(currentFileURL);
      expect(await checkURL(currentFileURL)).toBe(true);
    }
  });
});
