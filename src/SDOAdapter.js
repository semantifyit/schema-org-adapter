const Graph = require("./Graph");
const util = require("./utilities");

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

    getClass(URI, filter = null) {
        return this.graph.getClass(URI, filter)
    }
}

module.exports = SDOAdapter;