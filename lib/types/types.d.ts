import { Graph } from "../Graph";
import { TermTypeIRIValue, TermTypeLabelValue } from "../data/namespaces";
import { FilterObject } from "./FilterObject.type";
export interface ErrorFunction {
    (msg: string): void;
}
export declare type ParamObjSdoAdapter = {
    commit?: string;
    schemaHttps?: boolean;
    equateVocabularyProtocols?: boolean;
    onError?: ErrorFunction;
};
export declare type ToJsonTerm = {
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
export declare type ToJsonClass = ToJsonTerm & {
    superClasses: string[];
    subClasses: string[];
    properties: string[];
    rangeOf: string[];
};
export declare type ToJsonEnumeration = ToJsonClass & {
    enumerationMembers: string[];
};
export declare type ToJsonDataType = ToJsonTerm & {
    superDataTypes: string[];
    subDataTypes: string[];
    rangeOf: string[];
};
export declare type ToJsonEnumerationMember = ToJsonTerm & {
    domainEnumerations: string[];
};
export declare type ToJsonProperty = ToJsonTerm & {
    ranges: string[];
    domains: string[];
    superProperties: string[];
    subProperties: string[];
    inverseOf: string;
};
export declare type ContextWord = string;
export declare type ContextObject = Record<string, ContextWord>;
export declare type ContextEntry = ContextWord | ContextObject;
export declare type Context = Record<string, ContextEntry>;
export declare type VocabularyNode = Record<string, any>;
export declare type Vocabulary = {
    "@context": Context;
    "@graph": VocabularyNode[];
    "@id"?: string;
};
export declare type TermMemory = Record<string, VocabularyNode>;
export interface VersionsFile {
    schemaversion: string;
    releaseLog: Record<string, string>;
}
export interface FilterParamObj {
    data: string[];
    filter?: FilterObject;
    graph: Graph;
}
export interface LanguageObjectVocab {
    "@language": string;
    "@value": string;
}
export declare type LanguageObjectSdoAdapter = Record<string, string>;
export declare type CacheLiteral = string | number | object | boolean;
export declare type CacheEntry = Record<string, CacheLiteral>;
export declare type CacheMap = Map<string, CacheEntry>;
//# sourceMappingURL=types.d.ts.map