export = SDOAdapter;
/**
 * @typedef SDOAdapterParameterObject
 * @type {object}
 * @property {string} [commitBase] - The commit string from https://github.com/schemaorg/schemaorg which is the base for the adapter (if not given, we take the latest commit of our fork at https://github.com/semantifyit/schemaorg)
 * @property {boolean} [schemaHttps = true] - Enables the use of the https version of the schema.org vocabulary, it defaults to true. Only available for schema.org version 9.0 upwards.
 * @property {boolean} [equateVocabularyProtocols = false] - If true, treat namespaces as equal even if their protocols (http/https) are different, it defaults to false.
 * @property {Function} [onError] - A callback function(string) that is called when an unexpected error happens
 */
/**
 * @typedef filterObject
 * @type {object}
 * @property {boolean} [isSuperseded] - defines the superseded status for the filter (true: only terms that are superseded, false: only terms that are NOT superseded)
 * @property {string|string[]} [fromVocabulary] - defines a set of allowed vocabularies for the filter - vocabularies are given as indicators (e.g. "schema")
 * @property {string|string[]} [termType] - defines a set of allowed term types for the filter (e.g. "Class", "Property")
 */
declare class SDOAdapter {
    /**
     * The SDOAdapter is a JS-Class that represents the interface between the user and this library. Its methods enable to add vocabularies to its memory as well as retrieving vocabulary items. It is possible to create multiple instances of this JS-Class which use different vocabularies.
     *
     * @class
     * @param {SDOAdapterParameterObject} [parameterObject] - an optional parameter object with optional options for the constructor.
     */
    constructor(parameterObject?: SDOAdapterParameterObject);
    util: typeof import("./utilities");
    retrievalMemory: {
        versionsFile: any;
        latest: any;
    };
    commitBase: string;
    onError: Function;
    schemaHttps: boolean;
    equateVocabularyProtocols: boolean;
    graph: Graph;
    /**
     * Adds vocabularies (in JSON-LD format or as URL) to the memory of this SDOAdapter. The function "constructSDOVocabularyURL()" helps you to construct URLs for the schema.org vocabulary
     *
     * @param {string[]|object[]|string|object} vocabArray - The vocabular(y/ies) to add the graph, in JSON-LD format. Given directly as JSON or by a URL to fetch.
     * @returns {Promise<boolean>} This is an async function, returns true when done.
     */
    addVocabularies(vocabArray: string[] | object[] | string | object): Promise<boolean>;
    /**
     * Fetches a vocabulary from the given URL.
     *
     * @param {string} url - the URL from which the vocabulary should be fetched
     * @returns {Promise<object|string>} The fetched vocabulary object (or string, if the server returns a string instead of an object)
     */
    fetchVocabularyFromURL(url: string): Promise<object | string>;
    /**
     * Creates a corresponding JS-Class for the given IRI, depending on its term-category
     *
     * @param {string} id - The id of the wished term, can be an IRI (absolute or compact) or a label
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {Term} The JS-Class for the given IRI
     */
    getTerm(id: string, filter?: filterObject): Term;
    /**
     * Creates an array of JS-Classes for all vocabulary Terms (corresponding JS-Classes depending on the Term types)
     *
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {Class[]} An array of JS-Classes representing all vocabulary Terms
     */
    getAllTerms(filter?: filterObject): Class[];
    /**
     * Creates an array of IRIs for all vocabulary Terms
     *
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {string[]} An array of IRIs representing all vocabulary Terms
     */
    getListOfTerms(filter?: filterObject): string[];
    /**
     * Creates a JS-Class for a vocabulary Class by the given identifier (@id) or name
     *
     * @param {string} id - The identifier of the wished Class. It can be either a compact IRI -> "schema:Hotel", an absolute IRI -> "http://schema.org/Hotel", or the name (rdfs:label) -> "name" of the class (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {Class|Enumeration} The JS-Class representing a Class of an Enumeration (depending on the given id)
     */
    getClass(id: string, filter?: filterObject): Class | Enumeration;
    /**
     * Creates an array of JS-Classes for all vocabulary Classes
     *
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {Class[]} An array of JS-Classes representing all vocabulary Classes, does not include Enumerations
     */
    getAllClasses(filter?: filterObject): Class[];
    /**
     * Creates an array of IRIs for all vocabulary Classes
     *
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {string[]} An array of IRIs representing all vocabulary Classes, does not include Enumerations
     */
    getListOfClasses(filter?: filterObject): string[];
    /**
     * Creates a JS-Class for a vocabulary Property by the given identifier (@id) or name
     *
     * @param {string} id - The identifier of the wished Property. It can be either a compact IRI -> "schema:address", an absolute IRI -> "http://schema.org/address", or the name (rdfs:label) -> "address" of the Property (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {Property} The JS-Class representing a Property
     */
    getProperty(id: string, filter?: filterObject): Property;
    /**
     * Creates an array of JS-Classes for all vocabulary Properties
     *
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {Property[]} An array of JS-Classes representing all vocabulary Properties
     */
    getAllProperties(filter?: filterObject): Property[];
    /**
     * Creates an array of IRIs for all vocabulary Properties
     *
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {string[]} An array of IRIs representing all vocabulary Properties
     */
    getListOfProperties(filter?: filterObject): string[];
    /**
     * Creates a JS-Class for a vocabulary DataType by the given identifier (@id) or name
     *
     * @param {string} id - The identifier of the wished DataType. It can be either a compact IRI -> "schema:Number", an absolute IRI -> "http://schema.org/Number", or the name (rdfs:label) -> "Number" of the DataType (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {DataType} The JS-Class representing a DataType
     */
    getDataType(id: string, filter?: filterObject): DataType;
    /**
     * Creates an array of JS-Classes for all vocabulary DataTypes
     *
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {DataType[]} An array of JS-Classes representing all vocabulary DataTypes
     */
    getAllDataTypes(filter?: filterObject): DataType[];
    /**
     * Creates an array of IRIs for all vocabulary DataTypes
     *
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {string[]} An array of IRIs representing all vocabulary DataTypes
     */
    getListOfDataTypes(filter?: filterObject): string[];
    /**
     * Creates a JS-Class for a vocabulary Enumeration by the given identifier (@id) or name
     *
     * @param {string} id - The identifier of the wished Enumeration. It can be either a compact IRI -> "schema:DayOfWeek", an absolute IRI -> "http://schema.org/DayOfWeek", or the name (rdfs:label) -> "DayOfWeek" of the Enumeration (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {Enumeration} The JS-Class representing an Enumeration
     */
    getEnumeration(id: string, filter?: filterObject): Enumeration;
    /**
     * Creates an array of JS-Classes for all vocabulary Enumerations
     *
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {Enumeration[]} An array of JS-Classes representing all vocabulary Enumerations
     */
    getAllEnumerations(filter?: filterObject): Enumeration[];
    /**
     * Creates an array of IRIs for all vocabulary Enumerations
     *
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {string[]} An array of IRIs representing all vocabulary Enumerations
     */
    getListOfEnumerations(filter?: filterObject): string[];
    /**
     * Creates a JS-Class for a vocabulary EnumerationMember by the given identifier (@id) or name
     *
     * @param {string} id - The identifier of the wished EnumerationMember. It can be either a compact IRI -> "schema:Friday", an absolute IRI -> "http://schema.org/Friday", or the name (rdfs:label) -> "Friday" of the EnumerationMember (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {EnumerationMember} The JS-Class representing an EnumerationMember
     */
    getEnumerationMember(id: string, filter?: filterObject): EnumerationMember;
    /**
     * Creates an array of JS-Classes for all vocabulary EnumerationMember
     *
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {EnumerationMember[]} An array of JS-Classes representing all vocabulary EnumerationMember
     */
    getAllEnumerationMembers(filter?: filterObject): EnumerationMember[];
    /**
     * Creates an array of IRIs for all vocabulary EnumerationMember
     *
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {string[]} An array of IRIs representing all vocabulary EnumerationMember
     */
    getListOfEnumerationMembers(filter?: filterObject): string[];
    /**
     * Returns key-value pairs of the vocabularies used in this SDOAdapter
     *
     * @returns {object} An object containing the key-value pairs representing the used vocabularies
     */
    getVocabularies(): object;
    /**
     * Creates a URL pointing to the Schema.org vocabulary (the wished version can be specified). This URL can then be added to the SDOAdapter to retrieve the Schema.org vocabulary. Invalid version argument will result in errors, check https://schema.org/docs/developers.html for more information
     * To achieve this, the Schema.org version listing on https://raw.githubusercontent.com/schemaorg/schemaorg/main/versions.json is used.
     *
     * @param {string} [version = latest] - the wished Schema.org vocabulary version for the resulting URL (e.g. "5.0", "3.7", or "latest"). default: "latest"
     * @returns {Promise<string>} The URL to the Schema.org vocabulary
     */
    constructSDOVocabularyURL(version?: string): Promise<string>;
    /**
     * Retrieves the schema.org version listing at https://raw.githubusercontent.com/schemaorg/schemaorg/main/versions.json
     * and saves it in the local memory. Also sends head-requests to determine if the 'latest' version is really 'fetch-able'.
     * If not, this head-requests are done again for older versions until the latest valid version is determined and saved in the memory.
     *
     * @returns {Promise<boolean>} Returns true when the process ends
     */
    getSDOVersionFile(): Promise<boolean>;
    /**
     * Sends a head-request to the given URL, checking if content exists.
     *
     * @param {string} url - the URL to check
     * @returns {Promise<boolean>} Returns true if there is content
     */
    checkURL(url: string): Promise<boolean>;
    /**
     * Returns the latest version number of the schema.org vocabulary
     * To achieve this, the Schema.org version listing on https://raw.githubusercontent.com/schemaorg/schemaorg/main/versions.json is used.
     *
     * @returns {Promise<string>} The latest version of the schema.org vocabulary
     */
    getLatestSDOVersion(): Promise<string>;
    /**
     * Returns the base part of respective release URI
     *
     * @returns {string} The base part of respective release URI
     */
    getReleasesURI(): string;
    /**
     * Returns the URI of the respective versions file
     *
     * @returns {string} The URI of the respective versions file
     */
    getVersionFileURI(): string;
}
declare namespace SDOAdapter {
    export { SDOAdapterParameterObject, filterObject };
}
import Graph = require("./Graph");
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
import Term = require("./Term");
import Class = require("./Class");
import Enumeration = require("./Enumeration");
import Property = require("./Property");
import DataType = require("./DataType");
import EnumerationMember = require("./EnumerationMember");
type SDOAdapterParameterObject = {
    /**
     * - The commit string from https://github.com/schemaorg/schemaorg which is the base for the adapter (if not given, we take the latest commit of our fork at https://github.com/semantifyit/schemaorg)
     */
    commitBase?: string;
    /**
     * - Enables the use of the https version of the schema.org vocabulary, it defaults to true. Only available for schema.org version 9.0 upwards.
     */
    schemaHttps?: boolean;
    /**
     * - If true, treat namespaces as equal even if their protocols (http/https) are different, it defaults to false.
     */
    equateVocabularyProtocols?: boolean;
    /**
     * - A callback function(string) that is called when an unexpected error happens
     */
    onError?: Function;
};
