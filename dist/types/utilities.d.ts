export type filterObject = {
    /**
     * - defines the superseded status for the filter (true: only terms that are superseded, false: only terms that are NOT superseded)
     */
    isSuperseded?: boolean;
    /**
     * - defines a set of allowed vocabularies for the filter - vocabularies are given as indicators (e.g. "schema")
     */
    fromVocabulary?: string | string[];
    /**
     * - defines a set of allowed term types for the filter (e.g. "Class", "Property")
     */
    termType?: string | string[];
};
/**
 * @typedef filterObject
 * @type {object}
 * @property {boolean} [isSuperseded] - defines the superseded status for the filter (true: only terms that are superseded, false: only terms that are NOT superseded)
 * @property {string|string[]} [fromVocabulary] - defines a set of allowed vocabularies for the filter - vocabularies are given as indicators (e.g. "schema")
 * @property {string|string[]} [termType] - defines a set of allowed term types for the filter (e.g. "Class", "Property")
 */
/**
 * Applies a filter to the IRIs in the given Array
 *
 * @param {string[]} dataArray - Array of IRIs that should be filtered
 * @param {filterObject} filter - The filter settings used to filter the dataArray (can be undefined to return all data back)
 * @param {Graph} graph - the graph calling this function
 * @returns {string[]} Array of IRIs that are in compliance with the given filter options
 */
export function applyFilter(dataArray: string[], filter: filterObject, graph: Graph): string[];
/**
 * Creates a clone of the given JSON input (without reference to the original input)
 *
 * @param {any} input - the JSON element that should be copied
 * @returns {any} copy of the given JSON element
 */
export function cloneJson(input: any): any;
/**
 * Checks if the given input is a JS array
 *
 * @param {any} value - the input element to check
 * @returns {boolean} true if the given input is a JS array
 */
export function isArray(value: any): boolean;
/**
 * Checks if the given input is a string
 *
 * @param {any} value - the input element to check
 * @returns {boolean} true if the given input is a string
 */
export function isString(value: any): boolean;
/**
 * Checks if the given input is a JS object
 *
 * @param {any} value - the input element to check
 * @returns {boolean} true if the given input is a JS object
 */
export function isObject(value: any): boolean;
/**
 * Checks if the given input is undefined or null
 *
 * @param {any} value - the input element to check
 * @returns {boolean} true if the given input is undefined or null
 */
export function isNil(value: any): boolean;
/**
 * Removes duplicates from a given Array
 *
 * @param {Array} array - the input array
 * @returns {Array} the input array without duplicates
 */
export function uniquifyArray(array: any[]): any[];
/**
 * Transforms a given vocabulary to a wished format (including a given JSON-LD context)
 *
 * @param {object} vocab - the vocabulary to process
 * @param {object} newContext - the wished JSON-LD context that the vocabulary should have
 * @returns {object} the transformed vocabulary
 */
export function preProcessVocab(vocab: object, newContext: object): object;
/**
 * Merges 2 JSON-LD context objects into a new one
 *
 * @param {object} currentContext - the first context object
 * @param {object} newContext - the second context object
 * @returns {object} the resulting context object
 */
export function generateContext(currentContext: object, newContext: object): object;
/**
 * Processes a given vocabulary node to a wished format (we call this process "curation")
 *
 * @param {object} vocabNode - the input vocabulary node
 * @param {Array} vocabularies - the vocabularies used by the graph so far
 * @returns {object} the curated node
 */
export function curateVocabNode(vocabNode: object, vocabularies: any[]): object;
/**
 * Returns the compact IRI from a given absolute IRI and a corresponding context. If the context does not contain the used namespace, then 'null' is returned
 *
 * @param {string} absoluteIRI - the absolute IRI to transform
 * @param {object} context - the context object holding key-value pairs that represent indicator-namespace pairs
 * @param {boolean} [equateVocabularyProtocols = false] - treats namespaces as equal even if their protocols (http/https) are different, it defaults to false.
 * @returns {?string} the compact IRI (null, if given context does not contain the used namespace)
 */
export function toCompactIRI(absoluteIRI: string, context: object, equateVocabularyProtocols?: boolean): string | null;
/**
 * Returns the absolute IRI from a given compact IRI and a corresponding context. If the context does not contain the used namespace, then 'null' is returned
 *
 * @param {string} compactIRI - the compact IRI to transform
 * @param {object} context - the context object holding key-value pairs that represent indicator-namespace pairs
 * @returns {?string} the absolute IRI (null, if given context does not contain the used namespace)
 */
export function toAbsoluteIRI(compactIRI: string, context: object): string | null;
/**
 * Returns a sorted Array of Arrays that have a schema.org vocabulary version as first entry and it's release date as second entry. Latest is first in array.
 *
 * @param {object} releaseLog - the releaseLog object from the versionsFile of schema.org
 * @returns {Array} - Array with sorted release Arrays -> [version, date]
 */
export function sortReleaseEntriesByDate(releaseLog: object): any[];
/**
 * Returns the jsonld filename that holds the schema.org vocabulary for a given version.
 *
 * @param {string} version - the schema.org version
 * @param {boolean} [schemaHttps = true] - use https as protocol for the schema.org vocabulary - works only from version 9.0 upwards
 * @returns {string} - the corresponding jsonld filename
 */
export function getFileNameForSchemaOrgVersion(version: string, schemaHttps?: boolean): string;
/**
 * Returns the protocol version used for schema.org in the given vocabulary. Returns "https" as the default
 *
 * @param {object} vocabulary - the vocabulary in question
 * @returns {?string} - the corresponding protocol version, either "http" or "https"
 */
export function discoverUsedSchemaOrgProtocol(vocabulary: object): string | null;
/**
 * Checks if the given vocabulary uses terms (in context or content) that are present in the current given context but with another protocol (http/https), and returns those in a list
 *
 * @param {object} currentContext - the current context
 * @param {object} vocabulary - the vocabulary to be analyzed
 * @returns {string[]} - an array with the found equate namespaces
 */
export function discoverEquateNamespaces(currentContext: object, vocabulary: object): string[];
/**
 * Returns the given absolute IRI, but with the opposite protocol (http vs. https)
 *
 * @param  {string}IRI - the IRI that should be transformed
 * @returns {string} - the resulting transformed IRI
 */
export function switchIRIProtocol(IRI: string): string;
import Graph = require("./Graph");
