import { SOA, ParamObjCreateSdoAdapter } from "../src";

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
    ...params
  })
}
