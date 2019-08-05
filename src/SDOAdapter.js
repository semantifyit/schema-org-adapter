const Graph = require("./Graph");
const util = require("./utilities");

//const request = require("request");

class SDOAdapter {
    /**
     * The SDOAdapter is a JS-Class that represents the interface between the user and this library. Its methods enable to add vocabularies to its memory as well as retrieving vocabulary items. It is possible to create multiple instances of this JS-Class which use different vocabularies.
     * @constructor
     */
    constructor() {
        this.graph = new Graph(this);
    }

    /**
     * Adds vocabularies (in JSON-LD format or as URL) to the memory of this SDOAdapter
     * @param {object} vocabArray - The vocabularies to add the graph, in JSON-LD format
     * @param {function|null} callback - The callback function executed at the end of the loading process
     */
    async addVocabularies(vocabArray, callback) {
        if (util.isArray(vocabArray)) {
            //check every vocab if it is a valid JSON-LD. If string -> try to JSON.parse()
            for (let i = 0; i < vocabArray.length; i++) {
                if (util.isString(vocabArray[i])) {
                    try {
                        await this.graph.addVocabulary(JSON.parse(vocabArray[i]));
                    } catch (e) {
                        console.log("Parsing of vocabulary string produced an invalid JSON-LD.")
                    }
                } else if (util.isObject(vocabArray[i])) {
                    await this.graph.addVocabulary(vocabArray[i]);
                } else {
                    //invalid argument type!
                    throw new Error("The first argument of the function must be an Array of vocabularies (JSON-LD as Object/String)");
                }
            }
            if (callback !== null) {
                callback();
            }
        } else {
            throw new Error("The first argument of the function must be an Array of vocabularies (JSON-LD)");
        }
    }

    /**
     * Creates a JS-Class for a vocabulary Class by the given identifier (@id) or name
     * @param {string} id - The identifier of the wished Class. It can be either a compact IRI -> "schema:Hotel", an absolute IRI -> "http://schema.org/Hotel", or the name (rdfs:label) -> "name" of the class (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {object|null} filter - (default = null) an optional filter for the Class creation
     * @returns {Class|Enumeration} The JS-Class representing a Class of an Enumeration (depending on the given id)
     */
    getClass(id, filter = null) {
        //returns also enumerations
        return this.graph.getClass(id, filter)
    }

    /**
     * Creates an array of JS-Classes for all vocabulary Classes
     * @param {object|null} filter - (default = null) an optional filter for the Class creation
     * @returns {array} An array of JS-Classes representing all vocabulary Classes, does not include Enumerations
     */
    getAllClasses(filter = null) {
        let classesIRIList = this.getListOfClasses(filter);
        let result = [];
        for (let i = 0; i < classesIRIList.length; i++) {
            try {
                result.push(this.getClass(classesIRIList[i]));
            } catch (e) {

            }
        }
        return result;
    }

    /**
     * Creates an array of IRIs for all vocabulary Classes
     * @param {object|null} filter - (default = null) an optional filter for the List creation
     * @returns {array} An array of IRIs representing all vocabulary Classes, does not include Enumerations
     */
    getListOfClasses(filter = null) {
        //do not include enumerations
        return util.applyFilter(Object.keys(this.graph.classes), filter, this.graph);
    }

    /**
     * Creates a JS-Class for a vocabulary Property by the given identifier (@id) or name
     * @param {string} id - The identifier of the wished Property. It can be either a compact IRI -> "schema:address", an absolute IRI -> "http://schema.org/address", or the name (rdfs:label) -> "address" of the Property (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {object|null} filter - (default = null) an optional filter for the Property creation
     * @returns {Property} The JS-Class representing a Property
     */
    getProperty(id, filter = null) {
        return this.graph.getProperty(id, filter)
    }

    /**
     * Creates an array of JS-Classes for all vocabulary Properties
     * @param {object|null} filter - (default = null) an optional filter for the Property creation
     * @returns {array} An array of JS-Classes representing all vocabulary Properties
     */
    getAllProperties(filter = null) {
        let propertiesIRIList = this.getListOfProperties(filter);
        let result = [];
        for (let i = 0; i < propertiesIRIList.length; i++) {
            try {
                result.push(this.getProperty(propertiesIRIList[i]));
            } catch (e) {

            }
        }
        return result;
    }

    /**
     * Creates an array of IRIs for all vocabulary Properties
     * @param {object|null} filter - (default = null) an optional filter for the List creation
     * @returns {array} An array of IRIs representing all vocabulary Properties
     */
    getListOfProperties(filter = null) {
        return util.applyFilter(Object.keys(this.graph.properties), filter, this.graph);
    }

    /**
     * Creates a JS-Class for a vocabulary DataType by the given identifier (@id) or name
     * @param {string} id - The identifier of the wished DataType. It can be either a compact IRI -> "schema:Number", an absolute IRI -> "http://schema.org/Number", or the name (rdfs:label) -> "Number" of the DataType (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {object|null} filter - (default = null) an optional filter for the DataType creation
     * @returns {DataType} The JS-Class representing a DataType
     */
    getDataType(id, filter = null) {
        return this.graph.getDataType(id, filter)
    }

    /**
     * Creates an array of JS-Classes for all vocabulary DataTypes
     * @param {object|null} filter - (default = null) an optional filter for the DataType creation
     * @returns {array} An array of JS-Classes representing all vocabulary DataTypes
     */
    getAllDataTypes(filter = null) {
        let dataTypesIRIList = this.getListOfDataTypes(filter);
        let result = [];
        for (let i = 0; i < dataTypesIRIList.length; i++) {
            try {
                result.push(this.getDataType(dataTypesIRIList[i]));
            } catch (e) {

            }
        }
        return result;
    }

    /**
     * Creates an array of IRIs for all vocabulary DataTypes
     * @param {object|null} filter - (default = null) an optional filter for the List creation
     * @returns {array} An array of IRIs representing all vocabulary DataTypes
     */
    getListOfDataTypes(filter = null) {
        return util.applyFilter(Object.keys(this.graph.dataTypes), filter, this.graph);
    }

    /**
     * Creates a JS-Class for a vocabulary Enumeration by the given identifier (@id) or name
     * @param {string} id - The identifier of the wished Enumeration. It can be either a compact IRI -> "schema:DayOfWeek", an absolute IRI -> "http://schema.org/DayOfWeek", or the name (rdfs:label) -> "DayOfWeek" of the Enumeration (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {object|null} filter - (default = null) an optional filter for the Enumeration creation
     * @returns {Enumeration} The JS-Class representing an Enumeration
     */
    getEnumeration(id, filter = null) {
        return this.graph.getEnumeration(id, filter);
    }

    /**
     * Creates an array of JS-Classes for all vocabulary Enumerations
     * @param {object|null} filter - (default = null) an optional filter for the Enumeration creation
     * @returns {array} An array of JS-Classes representing all vocabulary Enumerations
     */
    getAllEnumerations(filter = null) {
        let enumerationsIRIList = this.getListOfEnumerations(filter);
        let result = [];
        for (let i = 0; i < enumerationsIRIList.length; i++) {
            try {
                result.push(this.getEnumeration(enumerationsIRIList[i]));
            } catch (e) {

            }
        }
        return result;
    }

    /**
     * Creates an array of IRIs for all vocabulary Enumerations
     * @param {object|null} filter - (default = null) an optional filter for the List creation
     * @returns {array} An array of IRIs representing all vocabulary Enumerations
     */
    getListOfEnumerations(filter = null) {
        return util.applyFilter(Object.keys(this.graph.enumerations), filter, this.graph);
    }

    /**
     * Creates a JS-Class for a vocabulary EnumerationMember by the given identifier (@id) or name
     * @param {string} id - The identifier of the wished EnumerationMember. It can be either a compact IRI -> "schema:Friday", an absolute IRI -> "http://schema.org/Friday", or the name (rdfs:label) -> "Friday" of the EnumerationMember (which may be ambiguous if multiple vocabularies/languages are used).
     * @param {object|null} filter - (default = null) an optional filter for the EnumerationMember creation
     * @returns {EnumerationMember} The JS-Class representing an EnumerationMember
     */
    getEnumerationMember(id, filter = null) {
        return this.graph.getEnumerationMember(id, filter);
    }

    /**
     * Creates an array of JS-Classes for all vocabulary EnumerationMember
     * @param {object|null} filter - (default = null) an optional filter for the EnumerationMember creation
     * @returns {array} An array of JS-Classes representing all vocabulary EnumerationMember
     */
    getAllEnumerationMembers(filter = null) {
        let enumerationMembersIRIList = this.getListOfEnumerationMembers(filter);
        let result = [];
        for (let i = 0; i < enumerationMembersIRIList.length; i++) {
            try {
                result.push(this.getEnumerationMember(enumerationMembersIRIList[i]));
            } catch (e) {

            }
        }
        return result;
    }

    /**
     * Creates an array of IRIs for all vocabulary EnumerationMember
     * @param {object|null} filter - (default = null) an optional filter for the List creation
     * @returns {array} An array of IRIs representing all vocabulary EnumerationMember
     */
    getListOfEnumerationMembers(filter = null) {
        return util.applyFilter(Object.keys(this.graph.enumerationMembers), filter, this.graph);
    }

    /**
     * Returns key-value pairs of the vocabularies used in this SDOAdapter
     * @returns {object} An object containing the key-value pairs representing the used vocabularies
     */
    getVocabularies() {
        let vocabKeys = Object.keys(this.graph.context);
        let result = {};
        let blacklist = ["soa", "xsd", "rdf", "rdfa", "rdfs", "dc"]; //standard vocabs that should not be exposed
        for (let i = 0; i < vocabKeys.length; i++) {
            if (util.isString(this.graph.context[vocabKeys[i]])) {
                if (blacklist.indexOf(vocabKeys[i]) === -1) {
                    result[vocabKeys[i]] = this.graph.context[vocabKeys[i]];
                }
            }
        }
        return result;
    }
}

module.exports = SDOAdapter;