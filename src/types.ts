import { Graph } from "./Graph";
import { TermTypeIRIValue, TermTypeLabelValue } from "./namespaces";

/**
 * SDO-Adapter provides various query-functions that accept a **FilterObject** as additional parameter to narrow down the results. These query-functions typically return arrays of IRIs for vocabulary terms. You could for example pass a filter to {@link getAllClasses | .getAllClasses()} to retrieve only classes from a specific vocabulary. You could pass a filter to {@link getRanges | .getRanges()} to get only the ranges of a property that are enumerations (without classes or data-types). The optional attributes for a filter are described below.
 *
 * @example
 * ```JS
 * // following filter can be passed to a function to retrieve only classes and enumerations that are from schema.org and are not superseded
 * {
 *   isSuperseded: false,
 *   fromVocabulary: ["https://schema.org/"],
 *   termType: [
 *     "Class",
 *     "Enumeration"
 *   ]
 * }
 * ```
 */
export type FilterObject = {
  /**
   * If true, only [superseded vocabulary terms](https://schema.org/supersededBy) are matched. If false, only vocabulary terms that are NOT superseded are matched.
   */
  isSuperseded?: boolean;
  /**
   * Namespaces for vocabularies (e.g. `"https://schema.org/"`) can be passed here, which matches only vocabulary terms that use any of the given namespaces in their IRI. You can check the namespaces and corresponding identifiers (e.g. `"schema"`) used by an {@link SDOAdapter | SDO-Adapter} instance with {@link getVocabularies | .getVocabularies()}. It is also possible to get the corresponding namespace of Term instance with {@link Class.getVocabulary | .getVocabulary()}.
   */
  fromVocabulary?: string | string[];
  /**
   * {@link TermTypeLabelValue | Term types} can be passed here, which matches only vocabulary terms that have any of the given term types.
   */
  termType?: TermTypeLabelValue | TermTypeLabelValue[];
};

export interface ErrorFunction {
  // eslint-disable-next-line no-unused-vars
  (msg: string): void;
}

/** @ignore */
export type ParamObjSdoAdapter = {
  commit?: string;
  schemaHttps?: boolean;
  equateVocabularyProtocols?: boolean;
  onError?: ErrorFunction;
};

/**
 *  A **parameter object** to {@link create | create a new SDO Adapter} instance. All attributes of this object are optional (as well as the parameter object itself) and describe a certain setting that should be used for the created {@link SDOAdapter | SDO Adapter}.
 *  @example
 * ```json
 * {
 *   schemaVersion: "latest",
 *   vocabularies: ["https://raw.githubusercontent.com/semantifyit/schema-org-adapter/master/tests/data/vocabulary-animal.json"],
 *   commit: "9a3ba46",
 *   schemaHttps: true,
 *   equateVocabularyProtocols: true,
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
};

/** @ignore */
export type ToJsonTerm = {
  id: string;
  IRI: string;
  typeLabel: TermTypeLabelValue;
  typeIRI: TermTypeIRIValue;
  vocabURLs: string[] | null;
  vocabulary: string | null;
  source: string | string[] | null;
  supersededBy: string | null;
  name: string | null;
  description: string | null;
};

/** @ignore */
export type ToJsonClass = ToJsonTerm & {
  superClasses: string[];
  subClasses: string[];
  properties: string[];
  rangeOf: string[];
};

/** @ignore */
export type ToJsonEnumeration = ToJsonClass & {
  enumerationMembers: string[];
};

/** @ignore */
export type ToJsonDataType = ToJsonTerm & {
  superDataTypes: string[];
  subDataTypes: string[];
  rangeOf: string[];
};

/** @ignore */
export type ToJsonEnumerationMember = ToJsonTerm & {
  domainEnumerations: string[];
};

/** @ignore */
export type ToJsonProperty = ToJsonTerm & {
  ranges: string[];
  domains: string[];
  superProperties: string[];
  subProperties: string[];
  inverseOf: string;
};

/** @ignore */
export type ContextWord = string;
/** @ignore */
export type ContextObject = Record<string, ContextWord>;
/** @ignore */
export type ContextEntry = ContextWord | ContextObject;

export type Context = Record<string, ContextEntry>;

/** @ignore */
export type VocabularyNode = Record<string, any>;

export type Vocabulary = {
  "@context": Context;
  "@graph": VocabularyNode[];
  "@id"?: string;
};

/** @ignore */
export interface VersionsFile {
  schemaversion: string;
  releaseLog: Record<string, string>;
}

/** @ignore */
export interface FilterParamObj {
  data: string[];
  filter?: FilterObject;
  graph: Graph;
}

/** @ignore */
export interface LanguageObjectVocab {
  "@language": string;
  "@value": string;
}

/** @ignore */
export type LanguageObjectSdoAdapter = Record<string, string>;

/** @ignore */
export type CacheLiteral = string | number | object | boolean;
/** @ignore */
export type CacheEntry = Record<string, CacheLiteral>;
/** @ignore */
export type CacheMap = Map<string, CacheEntry>;
