const Graph = require("./Graph");
const util = require("./utilities");
const request = require("request");

class SDOAdapter {
    /**
     * The SDOAdapter is a singleton class that represents the interface between the user and this library. Its methods enable to add vocabularies to its memory as well as retrieving vocabulary items
     * @constructor
     */
    constructor() {
        this.graph = new Graph(this);
    }

    /**
     * Adds vocabularies (in JSON-LD format or as URL) to the memory of the adapter
     * @param {object} vocabArray - The vocabularies to add the graph, in JSON-LD format or as URL
     * @param {function|null} callback - The callback function executed at the end of the loading process
     */
    async addVocabularies(vocabArray, callback) {
        if (util.isArray(vocabArray)) {
            //check every vocab if it is a valid JSON-LD. If non-url string -> try to JSON.Parse . If URL -> fetch
            for (let i = 0; i < vocabArray.length; i++) {
                if (util.isString(vocabArray[i])) {
                    //string -> URL
                    //todo
                } else if (util.isObject(vocabArray[i])) {
                    //object -> JSON-LD
                    await this.graph.addVocabulary(vocabArray[i]);
                } else {
                    //invalid argument type!
                    throw new Error("The first argument of the function must be an Array of vocabularies (URL as String or JSON-LD as Object)");
                }
            }
            if (callback !== null) {
                callback();
            }
        } else {
            throw new Error("The first argument of the function must be an Array of vocabularies (URL or JSON-LD)");
        }
    }

    async retrieveVocab(URL) {
        //todo retrieve a JSON-LD document from the given URL
    }

    getClass(id, filter = null) {
        return this.graph.getClass(id, filter)
    }

    getProperty(id, filter = null) {
        return this.graph.getProperty(id, filter)
    }

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