const Graph = require('./Graph');
const util = require('./utilities');
const axios = require('axios');

const URI_SEMANTIFY_GITHUB = 'https://raw.githubusercontent.com/semantifyit/schemaorg/main/';
const URI_SEMANTIFY_RELEASES = URI_SEMANTIFY_GITHUB + 'data/releases/';
const URI_SEMANTIFY_VERSIONS = URI_SEMANTIFY_GITHUB + 'versions.json';

class SDOAdapter {
    /**
     * The SDOAdapter is a JS-Class that represents the interface between the user and this library. Its methods enable to add vocabularies to its memory as well as retrieving vocabulary items. It is possible to create multiple instances of this JS-Class which use different vocabularies.
     *
     * @class
     * @param {object|null} parameterObject - an object with optional parameters for the constructor. There is 'commitBase': The commit string from https://github.com/schemaorg/schemaorg which is the base for the adapter (if not given, we take the latest commit of our fork at https://github.com/semantifyit/schemaorg). There is 'onError': A callback function(string) that is called when an unexpected error happens. There is 'schemaHttps': a boolean flag - use the https version of the schema.org vocabulary, it defaults to true. Only available if for schema.org version 9.0 upwards There is 'equateVocabularyProtocols': a boolean flag - treats namespaces as equal even if their protocols (http/https) are different, it defaults to false.
     */
    constructor(parameterObject = null) {
        this.retrievalMemory = {
            versionsFile: null,
            latest: null
        };
        // option commitBase - defaults to null
        if (parameterObject && parameterObject.commitBase) {
            this.commitBase = parameterObject.commitBase;
        } else {
            this.commitBase = null;
        }
        // option onError - defaults to a function that does nothing
        if (parameterObject && typeof parameterObject.onError === 'function') {
            this.onError = parameterObject.onError;
        } else {
            this.onError = function() {
                // do nothing; The users should pass their own function to handle errors, they have else no way to hide automatic error messages once the SDO Adapter is compiled
            };
        }
        // option schemaHttps - defaults to true
        if (parameterObject && parameterObject.schemaHttps !== undefined) {
            this.schemaHttps = parameterObject.schemaHttps;
        } else {
            this.schemaHttps = true;
        }
        // option equateVocabularyProtocols - defaults to false
        if (parameterObject && parameterObject.equateVocabularyProtocols !== undefined) {
            this.equateVocabularyProtocols = parameterObject.equateVocabularyProtocols;
        } else {
            this.equateVocabularyProtocols = false;
        }
        this.graph = new Graph(this);
    }

    /**
     * Adds vocabularies (in JSON-LD format or as URL) to the memory of this SDOAdapter. The function "constructSDOVocabularyURL()" helps you to construct URLs for the schema.org vocabulary
     *
     * @param {string[]|object[]|string|object} vocabArray - The vocabular(y/ies) to add the graph, in JSON-LD format. Given directly as JSON or by a URL to fetch.
     * @returns {Promise<void>} This is an async function
     */
    async addVocabularies(vocabArray) {
        if (!util.isArray(vocabArray) && (util.isString(vocabArray) || util.isObject(vocabArray))) {
            vocabArray = [vocabArray];
        }
        if (util.isArray(vocabArray)) {
            // check every vocab if it is a valid JSON-LD. If string -> try to JSON.parse()
            for (const vocab of vocabArray) {
                if (util.isString(vocab)) {
                    if (vocab.startsWith('www') || vocab.startsWith('http')) {
                        // assume it is a URL
                        try {
                            const fetchedVocab = await this.fetchVocabularyFromURL(vocab);
                            await this.graph.addVocabulary(fetchedVocab, vocab);
                        } catch (e) {
                            throw new Error('The given URL ' + vocab + ' did not contain a valid JSON-LD vocabulary.');
                        }
                    } else {
                        // assume it is a string-version of a JSON-LD
                        try {
                            await this.graph.addVocabulary(JSON.parse(vocab));
                        } catch (e) {
                            throw new Error('Parsing of vocabulary string produced an invalid JSON-LD.');
                        }
                    }
                } else if (util.isObject(vocab)) {
                    await this.graph.addVocabulary(vocab);
                } else {
                    // invalid argument type!
                    throw new Error('The first argument of the function must be an Array of vocabularies or a single vocabulary (JSON-LD as Object/String)');
                }
            }
        } else {
            throw new Error('The first argument of the function must be an Array of vocabularies or a single vocabulary (JSON-LD as Object/String)');
        }
    }

    /**
     * Fetches a vocabulary from the given URL.
     *
     * @param {string} url - the URL from which the vocabulary should be fetched
     * @returns {Promise<object>} - the fetched vocabulary object
     */
    async fetchVocabularyFromURL(url) {
        return new Promise(function(resolve, reject) {
            axios
                .get(url, {
                    headers: {
                        'Accept': 'application/ld+json, application/json'
                    }
                })
                .then(function(res) {
                    resolve(res.data);
                })
                .catch(function() {
                    reject('Could not find any resource at the given URL.');
                });
        });
    }

    /**
     * Creates a corresponding JS-Class for the given IRI, depending on its term-category
     *
     * @param {string} id - The id of the wished term, can be an IRI (absolute or compact) or a label
     * @param {object} filter - (optional) The filter settings to be applied on the result
     * @returns {Term} the JS-Class for the given IRI
     */
    getTerm(id, filter = null) {
        return this.graph.getTerm(id, filter);
    }

    /**
     * Creates an array of JS-Classes for all vocabulary Terms (corresponding JS-Classes depending on the Term types)
     *
     * @param {object|null} filter - (default = null) an optional filter for the Term creation
     * @returns {Class[]} An array of JS-Classes representing all vocabulary Terms
     */
    getAllTerms(filter = null) {
        const result = [];
        const classesIRIList = this.getListOfClasses(filter);
        const enumerationsIRIList = this.getListOfEnumerations(filter);
        const propertiesIRIList = this.getListOfProperties(filter);
        const dataTypesIRIList = this.getListOfDataTypes(filter);
        const enumerationMembersIRIList = this.getListOfEnumerationMembers(filter);
        for (let c of classesIRIList) {
            try {
                result.push(this.getClass(c));
            } catch (e) {
                throw new Error('There is no class with the IRI ' + c);
            }
        }
        for (let en of enumerationsIRIList) {
            try {
                result.push(this.getEnumeration(en));
            } catch (e) {
                throw new Error('There is no enumeration with the IRI ' + en);
            }
        }
        for (let p of propertiesIRIList) {
            try {
                result.push(this.getProperty(p));
            } catch (e) {
                throw new Error('There is no property with the IRI ' + p);
            }
        }
        for (let dt of dataTypesIRIList) {
            try {
                result.push(this.getDataType(dt));
            } catch (e) {
                throw new Error('There is no data type with the IRI ' + dt);
            }
        }
        for (let enm of enumerationMembersIRIList) {
            try {
                result.push(this.getEnumerationMember(enm));
            } catch (e) {
                throw new Error('There is no enumeration member with the IRI ' + enm);
            }
        }
        return result;
    }

    /**
     * Creates an array of IRIs for all vocabulary Terms
     *
     * @param {object|null} filter - (default = null) an optional filter for the List creation
     * @returns {string[]} An array of IRIs representing all vocabulary Terms
     */
    getListOfTerms(filter = null) {
        // do not include enumerations
        let result = [];
        result.push(...Object.keys(this.graph.classes));
        result.push(...Object.keys(this.graph.enumerations));
        result.push(...Object.keys(this.graph.properties));
        result.push(...Object.keys(this.graph.dataTypes));
        result.push(...Object.keys(this.graph.enumerationMembers));
        return util.applyFilter(result, filter, this.graph);
    }

    /**
     * Creates a JS-Class for a vocabulary Class by the given identifier (@id) or name
     *
     * @param {string} id - The identifier of the wished Class. It can be either a compact IRI -> "schema:Hotel", an absolute IRI -> "http://schema.org/Hotel", or the name (rdfs:label) -> "name" of the class (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {object|null} filter - (default = null) an optional filter for the Class creation
     * @returns {Class|Enumeration} The JS-Class representing a Class of an Enumeration (depending on the given id)
     */
    getClass(id, filter = null) {
        // returns also enumerations
        return this.graph.getClass(id, filter);
    }

    /**
     * Creates an array of JS-Classes for all vocabulary Classes
     *
     * @param {object|null} filter - (default = null) an optional filter for the Class creation
     * @returns {Class[]} An array of JS-Classes representing all vocabulary Classes, does not include Enumerations
     */
    getAllClasses(filter = null) {
        const result = [];
        const classesIRIList = this.getListOfClasses(filter);
        for (let c of classesIRIList) {
            try {
                result.push(this.getClass(c));
            } catch (e) {
                throw new Error('There is no class with the IRI ' + c);
            }
        }
        return result;
    }

    /**
     * Creates an array of IRIs for all vocabulary Classes
     *
     * @param {object|null} filter - (default = null) an optional filter for the List creation
     * @returns {string[]} An array of IRIs representing all vocabulary Classes, does not include Enumerations
     */
    getListOfClasses(filter = null) {
        // do not include enumerations
        return util.applyFilter(Object.keys(this.graph.classes), filter, this.graph);
    }

    /**
     * Creates a JS-Class for a vocabulary Property by the given identifier (@id) or name
     *
     * @param {string} id - The identifier of the wished Property. It can be either a compact IRI -> "schema:address", an absolute IRI -> "http://schema.org/address", or the name (rdfs:label) -> "address" of the Property (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {object|null} filter - (default = null) an optional filter for the Property creation
     * @returns {Property} The JS-Class representing a Property
     */
    getProperty(id, filter = null) {
        return this.graph.getProperty(id, filter);
    }

    /**
     * Creates an array of JS-Classes for all vocabulary Properties
     *
     * @param {object|null} filter - (default = null) an optional filter for the Property creation
     * @returns {Property[]} An array of JS-Classes representing all vocabulary Properties
     */
    getAllProperties(filter = null) {
        const result = [];
        const propertiesIRIList = this.getListOfProperties(filter);
        for (let p of propertiesIRIList) {
            try {
                result.push(this.getProperty(p));
            } catch (e) {
                throw new Error('There is no property with the IRI ' + p);
            }
        }
        return result;
    }

    /**
     * Creates an array of IRIs for all vocabulary Properties
     *
     * @param {object|null} filter - (default = null) an optional filter for the List creation
     * @returns {string[]} An array of IRIs representing all vocabulary Properties
     */
    getListOfProperties(filter = null) {
        return util.applyFilter(Object.keys(this.graph.properties), filter, this.graph);
    }

    /**
     * Creates a JS-Class for a vocabulary DataType by the given identifier (@id) or name
     *
     * @param {string} id - The identifier of the wished DataType. It can be either a compact IRI -> "schema:Number", an absolute IRI -> "http://schema.org/Number", or the name (rdfs:label) -> "Number" of the DataType (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {object|null} filter - (default = null) an optional filter for the DataType creation
     * @returns {DataType} The JS-Class representing a DataType
     */
    getDataType(id, filter = null) {
        return this.graph.getDataType(id, filter);
    }

    /**
     * Creates an array of JS-Classes for all vocabulary DataTypes
     *
     * @param {object|null} filter - (default = null) an optional filter for the DataType creation
     * @returns {DataType[]} An array of JS-Classes representing all vocabulary DataTypes
     */
    getAllDataTypes(filter = null) {
        const result = [];
        const dataTypesIRIList = this.getListOfDataTypes(filter);
        for (let dt of dataTypesIRIList) {
            try {
                result.push(this.getDataType(dt));
            } catch (e) {
                throw new Error('There is no data type with the IRI ' + dt);
            }
        }
        return result;
    }

    /**
     * Creates an array of IRIs for all vocabulary DataTypes
     *
     * @param {object|null} filter - (default = null) an optional filter for the List creation
     * @returns {string[]} An array of IRIs representing all vocabulary DataTypes
     */
    getListOfDataTypes(filter = null) {
        return util.applyFilter(Object.keys(this.graph.dataTypes), filter, this.graph);
    }

    /**
     * Creates a JS-Class for a vocabulary Enumeration by the given identifier (@id) or name
     *
     * @param {string} id - The identifier of the wished Enumeration. It can be either a compact IRI -> "schema:DayOfWeek", an absolute IRI -> "http://schema.org/DayOfWeek", or the name (rdfs:label) -> "DayOfWeek" of the Enumeration (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {object|null} filter - (default = null) an optional filter for the Enumeration creation
     * @returns {Enumeration} The JS-Class representing an Enumeration
     */
    getEnumeration(id, filter = null) {
        return this.graph.getEnumeration(id, filter);
    }

    /**
     * Creates an array of JS-Classes for all vocabulary Enumerations
     *
     * @param {object|null} filter - (default = null) an optional filter for the Enumeration creation
     * @returns {Enumeration[]} An array of JS-Classes representing all vocabulary Enumerations
     */
    getAllEnumerations(filter = null) {
        const result = [];
        const enumerationsIRIList = this.getListOfEnumerations(filter);
        for (let en of enumerationsIRIList) {
            try {
                result.push(this.getEnumeration(en));
            } catch (e) {
                throw new Error('There is no enumeration with the IRI ' + en);
            }
        }
        return result;
    }

    /**
     * Creates an array of IRIs for all vocabulary Enumerations
     *
     * @param {object|null} filter - (default = null) an optional filter for the List creation
     * @returns {string[]} An array of IRIs representing all vocabulary Enumerations
     */
    getListOfEnumerations(filter = null) {
        return util.applyFilter(Object.keys(this.graph.enumerations), filter, this.graph);
    }

    /**
     * Creates a JS-Class for a vocabulary EnumerationMember by the given identifier (@id) or name
     *
     * @param {string} id - The identifier of the wished EnumerationMember. It can be either a compact IRI -> "schema:Friday", an absolute IRI -> "http://schema.org/Friday", or the name (rdfs:label) -> "Friday" of the EnumerationMember (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {object|null} filter - (default = null) an optional filter for the EnumerationMember creation
     * @returns {EnumerationMember} The JS-Class representing an EnumerationMember
     */
    getEnumerationMember(id, filter = null) {
        return this.graph.getEnumerationMember(id, filter);
    }

    /**
     * Creates an array of JS-Classes for all vocabulary EnumerationMember
     *
     * @param {object|null} filter - (default = null) an optional filter for the EnumerationMember creation
     * @returns {EnumerationMember[]} An array of JS-Classes representing all vocabulary EnumerationMember
     */
    getAllEnumerationMembers(filter = null) {
        const result = [];
        const enumerationMembersIRIList = this.getListOfEnumerationMembers(filter);
        for (let enm of enumerationMembersIRIList) {
            try {
                result.push(this.getEnumerationMember(enm));
            } catch (e) {
                throw new Error('There is no enumeration member with the IRI ' + enm);
            }
        }
        return result;
    }

    /**
     * Creates an array of IRIs for all vocabulary EnumerationMember
     *
     * @param {object|null} filter - (default = null) an optional filter for the List creation
     * @returns {string[]} An array of IRIs representing all vocabulary EnumerationMember
     */
    getListOfEnumerationMembers(filter = null) {
        return util.applyFilter(Object.keys(this.graph.enumerationMembers), filter, this.graph);
    }

    /**
     * Returns key-value pairs of the vocabularies used in this SDOAdapter
     *
     * @returns {object} An object containing the key-value pairs representing the used vocabularies
     */
    getVocabularies() {
        const vocabKeys = Object.keys(this.graph.context);
        const result = {};
        const blacklist = ['soa', 'xsd', 'rdf', 'rdfa', 'rdfs', 'dc']; // standard vocabs that should not be exposed
        for (let i = 0; i < vocabKeys.length; i++) {
            if (util.isString(this.graph.context[vocabKeys[i]])) {
                if (blacklist.indexOf(vocabKeys[i]) === -1) {
                    result[vocabKeys[i]] = this.graph.context[vocabKeys[i]];
                }
            }
        }
        return result;
    }

    /**
     * Creates a URL pointing to the Schema.org vocabulary (the wished version can be specified). This URL can then be added to the SDOAdapter to retrieve the Schema.org vocabulary. Invalid version argument will result in errors, check https://schema.org/docs/developers.html for more information
     * To achieve this, the Schema.org version listing on https://raw.githubusercontent.com/schemaorg/schemaorg/main/versions.json is used.
     *
     * @param {?string} version - the wished Schema.org vocabulary version for the resulting URL (e.g. "5.0", "3.7", or "latest"). default: "latest"
     * @returns {Promise<string>} The URL to the Schema.org vocabulary
     */
    async constructSDOVocabularyURL(version = 'latest') {
        if (version === 'latest') {
            try {
                if (!this.retrievalMemory.versionsFile) {
                    // retrieve versionFile if needed (checks for latest and valid version)
                    await this.getSDOVersionFile();
                }
                version = this.retrievalMemory.latest;
            } catch (e) {
                console.error('Could not determine/retrieve the latest version of schema.org');
                throw e;
            }
        }
        const fileName = util.getFileNameForSchemaOrgVersion(version, this.schemaHttps); // This can throw an error if the version is <= 3.0
        return this.getReleasesURI() + version + '/' + fileName;
        // e.g. "https://raw.githubusercontent.com/schemaorg/schemaorg/main/data/releases/3.9/all-layers.jsonld";
    }

    /**
     * Retrieves the schema.org version listing at https://raw.githubusercontent.com/schemaorg/schemaorg/main/versions.json
     * and saves it in the local memory. Also sends head-requests to determine if the 'latest' version is really 'fetch-able'.
     * If not, this head-requests are done again for older versions until the latest valid version is determined and saved in the memory.
     *
     * @returns {Promise<void>} Returns void when the process ends (signalizing the process ending).
     */
    async getSDOVersionFile() {
        let versionFile;
        // 1. retrieve versions file
        try {
            versionFile = await axios.get(this.getVersionFileURI());
        } catch (e) {
            this.onError('Unable to retrieve the schema.org versions file at ' + this.getVersionFileURI());
            throw(e);
        }
        // 2. determine the latest valid version
        if (versionFile && versionFile.data) {
            this.retrievalMemory.versionsFile = versionFile.data;
            if (this.retrievalMemory.versionsFile.schemaversion) {
                if (await this.checkURL(await this.constructSDOVocabularyURL(this.retrievalMemory.versionsFile.schemaversion))) {
                    this.retrievalMemory.latest = this.retrievalMemory.versionsFile.schemaversion;
                } else {
                    // If the version stated as latest by schema.org doesnt exist, then try the other versions given in the release log until we find a valid one
                    if (this.retrievalMemory.versionsFile.releaseLog) {
                        const sortedArray = util.sortReleaseEntriesByDate(this.retrievalMemory.versionsFile.releaseLog);
                        // Sort release entries by the date. latest is first in array
                        for (const currVersion of sortedArray) {
                            if (await this.checkURL(await this.constructSDOVocabularyURL(currVersion[0]))) {
                                this.retrievalMemory.latest = currVersion[0];
                                break;
                            }
                        }
                    }
                    if (!this.retrievalMemory.latest) {
                        let errMsg = 'Could not find any valid vocabulary file in the Schema.org versions file (to be declared as "latest".';
                        this.onError(errMsg);
                        throw new Error(errMsg);
                    }
                }
                return;
            }
            let errMsg = 'Schema.org versions file has an unexpected structure!';
            this.onError(errMsg + ' -> ' + this.getVersionFileURI());
            throw new Error(errMsg);
        }
    }

    /**
     * Sends a head-request to the given URL, checking if content exists.
     *
     * @param {string} url - the URL to check
     * @returns {Promise<boolean>} - returns true if there is content
     */
    async checkURL(url) {
        try {
            await axios.head(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Returns the latest version number of the schema.org vocabulary
     * To achieve this, the Schema.org version listing on https://raw.githubusercontent.com/schemaorg/schemaorg/main/versions.json is used.
     *
     * @returns {Promise<string>} The latest version of the schema.org vocabulary
     */
    async getLatestSDOVersion() {
        if (!this.retrievalMemory.latest) {
            // retrieve versions file if needed (checks for latest and valid version)
            await this.getSDOVersionFile();
        }
        return this.retrievalMemory.latest;
    }

    /**
     * Returns the base part of respective release URI
     *
     * @returns {string} the base part of respective release URI
     */
    getReleasesURI() {
        return this.commitBase ? 'https://raw.githubusercontent.com/schemaorg/schemaorg/' + this.commitBase + '/data/releases/' : URI_SEMANTIFY_RELEASES;
    }

    /**
     * Returns the URI of the respective versions file
     *
     * @returns {string} the URI of the respective versions file
     */
    getVersionFileURI() {
        return this.commitBase ? 'https://raw.githubusercontent.com/schemaorg/schemaorg/' + this.commitBase + '/versions.json' : URI_SEMANTIFY_VERSIONS;
    }
}

module.exports = SDOAdapter;
