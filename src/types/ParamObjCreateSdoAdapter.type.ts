import { ErrorFunction, Vocabulary } from "./types";
import { OutputIRIType } from "./OutputIRIType.type";
import { FilterObject } from "./FilterObject.type";

/**
 *  A **parameter object** to {@link create | create a new SDO Adapter} instance. All attributes of this object are optional (as well as the parameter object itself) and describe a certain setting that should be used for the created {@link SDOAdapter | SDO Adapter}.
 *  @example
 * ```json
 * {
 *   schemaVersion: "latest",
 *   vocabularies: ["https://raw.githubusercontent.com/semantifyit/schema-org-adapter/master/tests/resources/data/vocabularies/vocabulary-animal.json"],
 *   commit: "9a3ba46",
 *   schemaHttps: true,
 *   equateVocabularyProtocols: true,
 *   outputFormat: "Compact",
 *   defaultFilter: {
 *    schemaModuleExclude: ["attic", "meta"],
 *    isSuperseded: false
 *   },
 *   onError: (e) => {
 *     console.error(e);
 *   }
 * }
 * ```
 * @privateRemarks
 * we redefine the declarations from ParamObjSdoAdapter here to make them visible in the documentation
 */
export type ParamObjCreateSdoAdapter = {
  /**
   * The commit string from https://github.com/schemaorg/schemaorg which is taken as source for the SDO Adapter (if not given, the latest commit of our fork at https://github.com/semantifyit/schemaorg is taken). Use this parameter only if you want to change the schema.org repository used as source for the SDO Adapter. By standard, SDO Adapter uses a fork of the schema.org repository, which is updated only when schema.org releases a new vocabulary version, and that version passes all tests of SDO Adapter.
   */
  commit?: string;
  /**
   * Enables the use of the https version of the schema.org vocabulary. Only available for schema.org version 9.0 upwards. (default = true)
   */
  schemaHttps?: boolean;
  /**
   * If true, treat namespaces in input vocabularies as equal even if their protocols (http/https) are different. (default = false)
   */
  equateVocabularyProtocols?: boolean;
  /**
   * A callback function(msg: string) that is called when an unexpected error happens.
   */
  onError?: ErrorFunction;
  /**
   * Vocabularies that should be added to the SDO Adapter right after initialization. You have to pass the vocabulary either as a JSON-LD object, or as a URL pointing at such a JSON-LD object. If you use the setting **schemaVersion** then you should not add a schema.org vocabulary here.
   */
  vocabularies?: (Vocabulary | string)[];
  /**
   * The schema.org vocabulary version that should be added to the SDO Adapter right after initialization. You have to pass only the version string, e.g. `"13.0"`. It is also possible to pass `"latest"` to automatically fetch the latest version of schema.org.
   */
  schemaVersion?: string;
  /**
   * Defines the format in which the IRI results from functions should be returned.
   * This option can be set for the SDO-Adapter on initialization, which becomes the standard (default = "Compact").
   * After the initialization it is also possible to pass this option to some API-functions to get IRIs in a different format. The options are as follows:
   * * "Compact": The resulting IRIs are given in compact form, e.g. "schema:Hotel"
   * * "Absolute": The resulting IRIs are given in absolute form, e.g. "https://schema.org/Hotel"
   */
  outputFormat?: OutputIRIType;
  /**
   * Sets a default filter for all results provided by the created SDO Adapter. Everytime no filter is passed to a function, this default filter is used.
   */
  defaultFilter?: FilterObject;
};
