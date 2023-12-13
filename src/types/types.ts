import { Graph } from "../Graph";
import { TermTypeIRIValue, TermTypeLabelValue } from "../data/namespaces";
import { FilterObject } from "./FilterObject.type";

/** @ignore */
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
export type TermMemory = Record<string, VocabularyNode>;

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
