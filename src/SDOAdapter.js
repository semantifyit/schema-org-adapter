const Graph = require("./Graph");
const util = require("./utilities");
const request = require("request");

class SDOAdapter {
    constructor() {
        this.graph = new Graph(this);
    }

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

            callback();
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