const SDOAdapter = require('../src/SDOAdapter');
const util = require('../src/utilities');

/**
 *  These tests check the retrieving of data from schema.org to ensure the correct functionality of vocabulary version determination and usage
 */
describe('Infrastructure testing', () => {
    // Check if the retrieval of the versionsFile from schema.org works.
    test('getVocabularyFile', async() => {
        const mySA = new SDOAdapter();
        await mySA.getSDOVersionFile();
        console.log(mySA.retrievalMemory);
    });

    // Check if the structure of the versionsFile from schema.org is the expected.
    test('vocabularyFileStructure', async() => {
        const mySA = new SDOAdapter();
        await mySA.getSDOVersionFile();
        console.log(mySA.retrievalMemory);
        // versionFile has expected structure
        expect(util.isObject(mySA.retrievalMemory.versionsFile)).toBe(true);
        expect(util.isObject(mySA.retrievalMemory.versionsFile.releaseLog)).toBe(true);
        expect(util.isString(mySA.retrievalMemory.versionsFile.schemaversion)).toBe(true);
        // latest version elaborated
        expect(util.isString(mySA.retrievalMemory.latest)).toBe(true);
    });

    // Check if the latest version found in the versionsFile is also the latest valid version elaborated by the schema-org-adapter adapter (schema-org-adapter only marks a version as valid if the corresponding vocabulary file exists)
    test('latestVersionIsCorrect', async() => {
        const mySA = new SDOAdapter();
        await mySA.getSDOVersionFile();
        // Sort release entries by the date. latest is first in array
        const sortedVersionsArray = util.sortReleaseEntriesByDate(mySA.retrievalMemory.versionsFile.releaseLog);
        // Latest (first) element of Array must be the same as the latest version found by schema-org-adapter
        console.log('Latest version by versionsFile: ' + sortedVersionsArray[0][0]);
        console.log('Latest version by schema-org-adapter: ' + mySA.retrievalMemory.latest);
        expect(sortedVersionsArray[0][0] === mySA.retrievalMemory.latest).toBe(true);
    });

    // Checks if the version files returned from getFileNameForSchemaOrgVersion() really exist (if they can be fetched)
    test('getAllVocabularyVersions', async() => {
        // 2.0 - 3.0 have no jsonld
        // 3.1 - 8.0 have all-layers.jsonld
        // 9.0 + have schemaorg-all-http.jsonld
        const mySA = new SDOAdapter();
        await mySA.getSDOVersionFile();
        for (const currentVersion of Object.keys(mySA.retrievalMemory.versionsFile.releaseLog)) {
            let currentFileName;
            let currentFileURL;
            try {
                currentFileName = util.getFileNameForSchemaOrgVersion(currentVersion);
            } catch (e) {
                // this version has no jsonld file, we skip it
                continue;
            }
            // let this function construct the URL. No error should happen.
            currentFileURL = await mySA.constructSDOVocabularyURL(currentVersion);
            console.log(currentFileURL);
            expect(await mySA.checkURL(currentFileURL)).toBe(true);
        }
    }, 30000);
});
