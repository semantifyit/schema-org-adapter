const Graph = require("./Graph");

class SDOAdapter {
    constructor() {
        this.graph = new Graph(this);
    }

    addVocabularies(vocabArray, callback) {
        if (Array.isArray(vocabArray)) {
            //check every vocab if it is a valid JSON-LD. If non-url string -> try to JSON.Parse . If URL -> fetch

            callback();
        } else {
            throw new Error("The first argument of the functions must be an Array of vocabularies (URL or JSONLD)");
        }
    }

    getClass(URI, filter = null){
        return this.graph.getClass(URI, filter)
    }
}

module.exports = SDOAdapter;