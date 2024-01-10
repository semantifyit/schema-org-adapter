import { SOA } from "../../src";
import axios from "axios";
import { debugFunc, commit } from "../resources/utilities/testUtilities";
import { isString } from "../../src/utilities/general/isString";
import { isObject } from "../../src/utilities/general/isObject";
import { getFileNameForSchemaOrgVersion } from "../../src/utilities/infrastructure/getFileNameForSchemaOrgVersion";
import { checkIfUrlExists } from "../../src/utilities/infrastructure/checkIfUrlExists";
import { sortReleaseEntriesByDate } from "../../src/utilities/infrastructure/sortReleaseEntriesByDate";

/* eslint-disable jest/no-conditional-expect */

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
    expect(isString(schemaVersions?.releaseLog?.[schemaVersions?.schemaversion])).toBe(true);
    expect(isString(await SOA.getLatestSchemaVersion(commit))).toBe(true);
  });

  // Check if the latest version found in the versionsFile is also the latest valid version elaborated by the schema-org-adapter adapter (schema-org-adapter only marks a version as valid if the corresponding vocabulary file exists)
  test("fetchSchemaVersions - latestVersionIsCorrect", async () => {
    const schemaVersions = await SOA.fetchSchemaVersions(false, commit);
    if (!schemaVersions) {
      throw new Error("SOA.fetchSchemaVersions() for commit: " + commit + " not working.");
    }
    // Sort release entries by the date. latest is first in array
    const sortedVersionsArray = sortReleaseEntriesByDate(schemaVersions.releaseLog);
    const latestVersion = await SOA.getLatestSchemaVersion(commit);
    // Latest (first) element of Array must be the same as the latest version found by schema-org-adapter
    debugFunc("Latest version by versionsFile: " + sortedVersionsArray[0][0]);
    debugFunc("Latest version by schema-org-adapter: " + latestVersion);
    expect(sortedVersionsArray[0][0] === latestVersion).toBe(true);
    // Check if the latest version is also officially declared on the schema.org website - if error -> does not exist
    await axios.get("https://github.com/schemaorg/schemaorg/tree/main/data/releases/" + sortedVersionsArray[0][0]);
  });

  // Checks if the version files returned from getFileNameForSchemaOrgVersion() really exist (if they can be fetched)
  test("fetchSchemaVersions - getAllVocabularyVersions", async () => {
    // 2.0 - 3.0 have no jsonld
    // 3.1 - 8.0 have all-layers.jsonld (no https variant)
    // 9.0 + have schemaorg-all-http(s).jsonld
    const schemaVersions = await SOA.fetchSchemaVersions(false, commit);
    if (!schemaVersions) {
      throw new Error("SOA.fetchSchemaVersions() for commit: " + commit + " not working.");
    }
    for (const currentVersion of Object.keys(schemaVersions.releaseLog)) {
      if (Number(currentVersion) < 3.1) {
        expect(() => getFileNameForSchemaOrgVersion(currentVersion, false)).toThrow(
          "no jsonld file for the wanted schema.org version"
        );
        expect(() => getFileNameForSchemaOrgVersion(currentVersion, true)).toThrow(
          "no jsonld file for the wanted schema.org version"
        );
      } else if (Number(currentVersion) < 9.0) {
        const fileNameHttp = getFileNameForSchemaOrgVersion(currentVersion, false);
        const fileNameHttps = getFileNameForSchemaOrgVersion(currentVersion, true);
        expect(fileNameHttp).toBe(fileNameHttps);
        expect(fileNameHttp.includes("all-layers")).toBeTruthy();
        expect(await checkIfUrlExists(await SOA.constructURLSchemaVocabulary(currentVersion, true, commit))).toBe(true);
      } else {
        const fileNameHttp = getFileNameForSchemaOrgVersion(currentVersion, false);
        const fileNameHttps = getFileNameForSchemaOrgVersion(currentVersion, true);
        expect(fileNameHttp).not.toBe(fileNameHttps);
        expect(fileNameHttp.includes("org-all-http.j")).toBeTruthy();
        expect(fileNameHttps.includes("org-all-https.j")).toBeTruthy();
        expect(await checkIfUrlExists(await SOA.constructURLSchemaVocabulary(currentVersion, false, commit))).toBe(
          true
        );
        expect(await checkIfUrlExists(await SOA.constructURLSchemaVocabulary(currentVersion, true, commit))).toBe(true);
      }
    }
  });
});
