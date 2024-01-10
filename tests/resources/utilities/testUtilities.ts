import { SOA, ParamObjCreateSdoAdapter, SDOAdapter } from "../../../src";
import { getFileNameForSchemaOrgVersion } from "../../../src/utilities/infrastructure/getFileNameForSchemaOrgVersion";
import VOC_OBJ_ZOO from "../data/vocabularies/vocabulary-animal.json";
import { isString } from "../../../src/utilities/general/isString";

export type SdoAdapterMap = Record<string, SDOAdapter>;

const CONSOLE_OUTPUT = false; // Change to "true" if you want to see console.log and console.error outputs for the tests

/**
 * console.log() output, only if CONSOLE_OUTPUT is set to "true" in file testUtility.js
 *
 * @param {string} out - the output string
 */
export function debugFunc(out: unknown) {
  if (CONSOLE_OUTPUT) {
    console.log(out);
  }
}

/**
 * console.error() output, only if CONSOLE_OUTPUT is set to "true" in file testUtility.js
 *
 * @param {string} out - the output string
 */
export function debugFuncErr(out: unknown) {
  if (CONSOLE_OUTPUT) {
    console.error(out);
  }
}

/**
 * executes the given test function for each SDO-Adapter in the given SDO-Adapter-Map
 * @param sdoAdapterMap - the SDO Adapter map with SDO-Adapter for all schema.org versions
 * @param fn - the test function to be tested
 */
export async function executeTestForEach(
  sdoAdapterMap: SdoAdapterMap,
  // eslint-disable-next-line no-unused-vars
  fn: (sdoAdapter: SDOAdapter) => void
) {
  for (const v of Object.keys(sdoAdapterMap)) {
    console.log("schema version " + v);
    fn(sdoAdapterMap[v]);
  }
}

// https://github.com/schemaorg/schemaorg/commits/main
export const commit = process.env.COMMIT;

/**
 *  returns the initialized SDO-Adapter ready for testing
 */
export async function testSdoAdapter(params: Partial<ParamObjCreateSdoAdapter> = {}) {
  return SOA.create({
    commit,
    onError: debugFuncErr,
    schemaVersion: "latest",
    vocabularies: [],
    outputFormat: "Compact",
    ...params
  });
}

/**
 *  creates an SDO-Adapter for testing for each version of schema.org available
 *  (includes also the custom Zoo Vocabulary to test external vocabularies)
 */
export async function initializeSdoAdapterMap() {
  const sdoAdapterMap: SdoAdapterMap = {};
  const schemaVersions = (await SOA.fetchSchemaVersions(false, commit)).releaseLog;
  for (const v of Object.keys(schemaVersions)) {
    try {
      getFileNameForSchemaOrgVersion(v);
      sdoAdapterMap[v] = await testSdoAdapter({
        vocabularies: [VOC_OBJ_ZOO],
        schemaVersion: v,
        equateVocabularyProtocols: true
      });
    } catch (e) {
      // console.log(e)
    }
  }
  return sdoAdapterMap;
}

/**
 * Returns true if the given input is (string) or includes (string array) the given absolute IRI with http or https.
 * This test utility helps to check the different schema versions (older ones didn't have https available)
 *
 * @param input - the input string or array of strings that should be checked1
 * @param expectedIRIWithoutProtocol - the absolute IRI that should be searched for (without http/s protocol)
 */
export function isOrIncludesAbsoluteIRI(input: string|string[],expectedIRIWithoutProtocol: string){
  if(isString(input)) {
    return input === "https://" + expectedIRIWithoutProtocol || input === "http://" + expectedIRIWithoutProtocol
  }
  //is Array
  return input.includes("https://"+expectedIRIWithoutProtocol) ||
    input.includes("http://"+expectedIRIWithoutProtocol)
}
