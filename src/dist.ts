import { SDOAdapter } from "./SDOAdapter";
import {
  fetchSchemaVersions,
  getLatestSchemaVersion,
  constructURLSchemaVocabulary,
} from "./Infrastructure";
import { ParamObjCreateSdoAdapter } from "./types/ParamObjCreateSdoAdapter.type";

/**
 * Creates a new {@link SDOAdapter | SDO Adapter} instance. The optional {@link ParamObjCreateSdoAdapter | parameter object} can help you to pass settings to the SDO Adapter. Have a look to understand the possible settings and default values. The minimal setting you would like to pass is the schema.org vocabulary version you want to use.
 *
 * @example
 *
 * ```JS
 * const { SOA } = require("schema-org-adapter");
 * // create a new SDOAdapter instance with the latest version of schema.org
 * const mySdoAdapter = await SOA.create({schemaVersion: "latest"});
 * ```
 *
 * @param paramObj An optional parameter object that describes initialization settings for the newly created SDO Adapter instance.
 */
async function create(paramObj?: ParamObjCreateSdoAdapter) {
  const newInstance = new SDOAdapter(paramObj);
  if (paramObj && paramObj.schemaVersion) {
    const schemaUrl = await constructURLSchemaVocabulary(
      paramObj.schemaVersion,
      paramObj.schemaHttps,
      paramObj.commit
    );
    await newInstance.addVocabularies(schemaUrl);
  }
  if (paramObj && paramObj.vocabularies) {
    await newInstance.addVocabularies(paramObj.vocabularies);
  }
  return newInstance;
}

// export as separate functions for bundled dist
export {
  create,
  fetchSchemaVersions,
  getLatestSchemaVersion,
  constructURLSchemaVocabulary,
};
