export = SDOAdapter;
declare class SDOAdapter {
    /**
     * The SDOAdapter is a JS-Class that represents the interface between the user and this library. Its methods enable to add vocabularies to its memory as well as retrieving vocabulary items. It is possible to create multiple instances of this JS-Class which use different vocabularies.
     *
     * @class
     * @param {object|null} parameterObject - an object with optional parameters for the constructor. There is 'commitBase': The commit string from https://github.com/schemaorg/schemaorg which is the base for the adapter (if not given, we take the latest commit of our fork at https://github.com/semantifyit/schemaorg). There is 'onError': A callback function(string) that is called when an unexpected error happens. There is 'schemaHttps': a boolean flag - use the https version of the schema.org vocabulary, it defaults to true. Only available if for schema.org version 9.0 upwards There is 'equateVocabularyProtocols': a boolean flag - treats namespaces as equal even if their protocols (http/https) are different, it defaults to false.
     */
    constructor(parameterObject?: object | null);
    retrievalMemory: {
        versionsFile: any;
        latest: any;
    };
    commitBase: any;
    onError: any;
    schemaHttps: any;
    equateVocabularyProtocols: any;
    graph: Graph;
    /**
     * Adds vocabularies (in JSON-LD format or as URL) to the memory of this SDOAdapter. The function "constructSDOVocabularyURL()" helps you to construct URLs for the schema.org vocabulary
     *
     * @param {string[]|object[]|string|object} vocabArray - The vocabular(y/ies) to add the graph, in JSON-LD format. Given directly as JSON or by a URL to fetch.
     * @returns {Promise<void>} This is an async function
     */
    addVocabularies(vocabArray: string[] | object[] | string | object): Promise<void>;
    /**
     * Fetches a vocabulary from the given URL.
     *
     * @param {string} url - the URL from which the vocabulary should be fetched
     * @returns {Promise<object>| Promise<string>} - the fetched vocabulary object (or string, if the server returns a string instead of an object)
     */
    fetchVocabularyFromURL(url: string): Promise<object> | Promise<string>;
    /**
     * Creates a corresponding JS-Class for the given IRI, depending on its term-category
     *
     * @param {string} id - The id of the wished term, can be an IRI (absolute or compact) or a label
     * @param {object} filter - (optional) The filter settings to be applied on the result
     * @returns {Term} the JS-Class for the given IRI
     */
    getTerm(id: string, filter?: object): any;
    /**
     * Creates an array of JS-Classes for all vocabulary Terms (corresponding JS-Classes depending on the Term types)
     *
     * @param {object|null} filter - (default = null) an optional filter for the Term creation
     * @returns {Class[]} An array of JS-Classes representing all vocabulary Terms
     */
    getAllTerms(filter?: object | null): any[];
    /**
     * Creates an array of IRIs for all vocabulary Terms
     *
     * @param {object|null} filter - (default = null) an optional filter for the List creation
     * @returns {string[]} An array of IRIs representing all vocabulary Terms
     */
    getListOfTerms(filter?: object | null): string[];
    /**
     * Creates a JS-Class for a vocabulary Class by the given identifier (@id) or name
     *
     * @param {string} id - The identifier of the wished Class. It can be either a compact IRI -> "schema:Hotel", an absolute IRI -> "http://schema.org/Hotel", or the name (rdfs:label) -> "name" of the class (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {object|null} filter - (default = null) an optional filter for the Class creation
     * @returns {Class|Enumeration} The JS-Class representing a Class of an Enumeration (depending on the given id)
     */
    getClass(id: string, filter?: object | null): any | any;
    /**
     * Creates an array of JS-Classes for all vocabulary Classes
     *
     * @param {object|null} filter - (default = null) an optional filter for the Class creation
     * @returns {Class[]} An array of JS-Classes representing all vocabulary Classes, does not include Enumerations
     */
    getAllClasses(filter?: object | null): any[];
    /**
     * Creates an array of IRIs for all vocabulary Classes
     *
     * @param {object|null} filter - (default = null) an optional filter for the List creation
     * @returns {string[]} An array of IRIs representing all vocabulary Classes, does not include Enumerations
     */
    getListOfClasses(filter?: object | null): string[];
    /**
     * Creates a JS-Class for a vocabulary Property by the given identifier (@id) or name
     *
     * @param {string} id - The identifier of the wished Property. It can be either a compact IRI -> "schema:address", an absolute IRI -> "http://schema.org/address", or the name (rdfs:label) -> "address" of the Property (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {object|null} filter - (default = null) an optional filter for the Property creation
     * @returns {Property} The JS-Class representing a Property
     */
    getProperty(id: string, filter?: object | null): any;
    /**
     * Creates an array of JS-Classes for all vocabulary Properties
     *
     * @param {object|null} filter - (default = null) an optional filter for the Property creation
     * @returns {Property[]} An array of JS-Classes representing all vocabulary Properties
     */
    getAllProperties(filter?: object | null): any[];
    /**
     * Creates an array of IRIs for all vocabulary Properties
     *
     * @param {object|null} filter - (default = null) an optional filter for the List creation
     * @returns {string[]} An array of IRIs representing all vocabulary Properties
     */
    getListOfProperties(filter?: object | null): string[];
    /**
     * Creates a JS-Class for a vocabulary DataType by the given identifier (@id) or name
     *
     * @param {string} id - The identifier of the wished DataType. It can be either a compact IRI -> "schema:Number", an absolute IRI -> "http://schema.org/Number", or the name (rdfs:label) -> "Number" of the DataType (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {object|null} filter - (default = null) an optional filter for the DataType creation
     * @returns {DataType} The JS-Class representing a DataType
     */
    getDataType(id: string, filter?: object | null): any;
    /**
     * Creates an array of JS-Classes for all vocabulary DataTypes
     *
     * @param {object|null} filter - (default = null) an optional filter for the DataType creation
     * @returns {DataType[]} An array of JS-Classes representing all vocabulary DataTypes
     */
    getAllDataTypes(filter?: object | null): any[];
    /**
     * Creates an array of IRIs for all vocabulary DataTypes
     *
     * @param {object|null} filter - (default = null) an optional filter for the List creation
     * @returns {string[]} An array of IRIs representing all vocabulary DataTypes
     */
    getListOfDataTypes(filter?: object | null): string[];
    /**
     * Creates a JS-Class for a vocabulary Enumeration by the given identifier (@id) or name
     *
     * @param {string} id - The identifier of the wished Enumeration. It can be either a compact IRI -> "schema:DayOfWeek", an absolute IRI -> "http://schema.org/DayOfWeek", or the name (rdfs:label) -> "DayOfWeek" of the Enumeration (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {object|null} filter - (default = null) an optional filter for the Enumeration creation
     * @returns {Enumeration} The JS-Class representing an Enumeration
     */
    getEnumeration(id: string, filter?: object | null): any;
    /**
     * Creates an array of JS-Classes for all vocabulary Enumerations
     *
     * @param {object|null} filter - (default = null) an optional filter for the Enumeration creation
     * @returns {Enumeration[]} An array of JS-Classes representing all vocabulary Enumerations
     */
    getAllEnumerations(filter?: object | null): any[];
    /**
     * Creates an array of IRIs for all vocabulary Enumerations
     *
     * @param {object|null} filter - (default = null) an optional filter for the List creation
     * @returns {string[]} An array of IRIs representing all vocabulary Enumerations
     */
    getListOfEnumerations(filter?: object | null): string[];
    /**
     * Creates a JS-Class for a vocabulary EnumerationMember by the given identifier (@id) or name
     *
     * @param {string} id - The identifier of the wished EnumerationMember. It can be either a compact IRI -> "schema:Friday", an absolute IRI -> "http://schema.org/Friday", or the name (rdfs:label) -> "Friday" of the EnumerationMember (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {object|null} filter - (default = null) an optional filter for the EnumerationMember creation
     * @returns {EnumerationMember} The JS-Class representing an EnumerationMember
     */
    getEnumerationMember(id: string, filter?: object | null): any;
    /**
     * Creates an array of JS-Classes for all vocabulary EnumerationMember
     *
     * @param {object|null} filter - (default = null) an optional filter for the EnumerationMember creation
     * @returns {EnumerationMember[]} An array of JS-Classes representing all vocabulary EnumerationMember
     */
    getAllEnumerationMembers(filter?: object | null): any[];
    /**
     * Creates an array of IRIs for all vocabulary EnumerationMember
     *
     * @param {object|null} filter - (default = null) an optional filter for the List creation
     * @returns {string[]} An array of IRIs representing all vocabulary EnumerationMember
     */
    getListOfEnumerationMembers(filter?: object | null): string[];
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
     * @param {?string} version - the wished Schema.org vocabulary version for the resulting URL (e.g. "5.0", "3.7", or "latest"). default: "latest"
     * @returns {Promise<string>} The URL to the Schema.org vocabulary
     */
    constructSDOVocabularyURL(version?: string | null): Promise<string>;
    /**
     * Retrieves the schema.org version listing at https://raw.githubusercontent.com/schemaorg/schemaorg/main/versions.json
     * and saves it in the local memory. Also sends head-requests to determine if the 'latest' version is really 'fetch-able'.
     * If not, this head-requests are done again for older versions until the latest valid version is determined and saved in the memory.
     *
     * @returns {Promise<void>} Returns void when the process ends (signalizing the process ending).
     */
    getSDOVersionFile(): Promise<void>;
    /**
     * Sends a head-request to the given URL, checking if content exists.
     *
     * @param {string} url - the URL to check
     * @returns {Promise<boolean>} - returns true if there is content
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
     * @returns {string} the base part of respective release URI
     */
    getReleasesURI(): string;
    /**
     * Returns the URI of the respective versions file
     *
     * @returns {string} the URI of the respective versions file
     */
    getVersionFileURI(): string;
}
import Graph = require("./Graph");
