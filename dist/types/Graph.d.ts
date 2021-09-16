export = Graph;
/**
 * @typedef filterObject
 * @type {object}
 * @property {boolean} [isSuperseded] - defines the superseded status for the filter (true: only terms that are superseded, false: only terms that are NOT superseded)
 * @property {string|string[]} [fromVocabulary] - defines a set of allowed vocabularies for the filter - vocabularies are given as indicators (e.g. "schema")
 * @property {string|string[]} [termType] - defines a set of allowed term types for the filter (e.g. "Class", "Property")
 */
declare class Graph {
    /**
     * @class
     * @param {any} sdoAdapter - The parent sdoAdapter-class to which this Graph belongs
     */
    constructor(sdoAdapter: any);
    sdoAdapter: any;
    util: typeof import("./utilities");
    reasoner: ReasoningEngine;
    context: {
        rdf: string;
        rdfs: string;
        xsd: string;
        dc: string;
        soa: string;
        "soa:superClassOf": {
            "@id": string;
            "@type": string;
        };
        "soa:superPropertyOf": {
            "@id": string;
            "@type": string;
        };
        "soa:hasProperty": {
            "@id": string;
            "@type": string;
        };
        "soa:isRangeOf": {
            "@id": string;
            "@type": string;
        };
        "soa:hasEnumerationMember": {
            "@id": string;
            "@type": string;
        };
        "soa:enumerationDomainIncludes": {
            "@id": string;
            "@type": string;
        };
        "rdfs:subClassOf": {
            "@id": string;
            "@type": string;
        };
        "rdfs:subPropertyOf": {
            "@id": string;
            "@type": string;
        };
        "schema:isPartOf": {
            "@id": string;
            "@type": string;
        };
        "schema:domainIncludes": {
            "@id": string;
            "@type": string;
        };
        "schema:rangeIncludes": {
            "@id": string;
            "@type": string;
        };
        "schema:supersededBy": {
            "@id": string;
            "@type": string;
        };
        "schema:inverseOf": {
            "@id": string;
            "@type": string;
        };
        "dc:source": {
            "@id": string;
            "@type": string;
        };
        "schema:source": {
            "@id": string;
            "@type": string;
        };
    };
    classes: {};
    properties: {};
    dataTypes: {};
    enumerations: {};
    enumerationMembers: {};
    /**
     * Adds a new vocabulary (in JSON-LD format) to the graph data
     *
     * @param {object} vocab - The vocabulary to add the graph, in JSON-LD format
     * @param {?string} vocabURL - The URL of the vocabulary
     * @returns {Promise<boolean>} returns true on success
     */
    addVocabulary(vocab: object, vocabURL?: string | null): Promise<boolean>;
    /**
     * Creates/Updates a node in the graph
     *
     * @param {object} memory - The memory object where the new node should be added (Classes, Properties, Enumerations, EnumerationMembers, DataTypes)
     * @param {object} newNode - The node in JSON-LD format to be added
     * @param {string} [vocabURL] - The vocabulary URL of the node
     * @returns {boolean} returns true on success
     */
    addGraphNode(memory: object, newNode: object, vocabURL?: string): boolean;
    /**
     * Creates a corresponding JS-Class for the given IRI, depending on its category in the Graph
     *
     * @param {string} id - The id of the wished term, can be an IRI (absolute or compact) or a label
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {Term} the JS-Class for the given IRI
     */
    getTerm(id: string, filter?: filterObject): any;
    /**
     * Creates a JS-Class for a Class of the Graph
     *
     * @param {string} id - The id of the wished Class-node, can be an IRI (absolute or compact) or a label
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {Class|Enumeration} the JS-Class for the given IRI
     */
    getClass(id: string, filter?: filterObject): Class | Enumeration;
    /**
     * Creates a JS-Class for a Property of the Graph
     *
     * @param {string} id - The id of the wished Property-node, can be an IRI (absolute or compact) or a label
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {Property} the JS-Class for the given IRI
     */
    getProperty(id: string, filter?: filterObject): Property;
    /**
     * Creates a JS-Class for a DataType of the Graph
     *
     * @param {string} id - The id of the wished DataType-node, can be an IRI (absolute or compact) or a label
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {DataType} the JS-Class for the given IRI
     */
    getDataType(id: string, filter?: filterObject): DataType;
    /**
     * Creates a JS-Class for an Enumeration of the Graph
     *
     * @param {string} id - The id of the wished Enumeration-node, can be an IRI (absolute or compact) or a label
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {Enumeration} the JS-Class for the given IRI
     */
    getEnumeration(id: string, filter?: filterObject): Enumeration;
    /**
     * Creates a JS-Class for an EnumerationMember of the Graph
     *
     * @param {string} id - The id of the wished EnumerationMember-node, can be an IRI (absolute or compact) or a label
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {EnumerationMember} the JS-Class for the given IRI
     */
    getEnumerationMember(id: string, filter?: filterObject): EnumerationMember;
    /**
     * Transforms/Discovers the right compact IRI for a given input, which may be a already a compact IRI, or an absolute IRI, or a term label for a vocabulary member
     *
     * @param {string} input - The input string to discover (if label) or transform (if absolute IRI)
     * @returns {?string} the corresponding compact IRI (null if input is not valid)
     */
    discoverCompactIRI(input: string): string | null;
    /**
     * Checks if a given term object contains a given label string. Helper function for discoverCompactIRI()
     *
     * @param {object} termObj - the term node
     * @param {string} label - the language to check
     * @returns {boolean} returns true, if the termObj uses the given label (in any language)
     */
    containsLabel(termObj: object, label: string): boolean;
}
declare namespace Graph {
    export { filterObject };
}
import ReasoningEngine = require("./ReasoningEngine");
type filterObject = {
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
import Class = require("./Class");
import Enumeration = require("./Enumeration");
import Property = require("./Property");
import DataType = require("./DataType");
import EnumerationMember = require("./EnumerationMember");
