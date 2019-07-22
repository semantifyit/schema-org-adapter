const util = require("./utilities");
const inputCuration = require("./inputCuration");


class GraphClass {
    constructor(node) {
        let subclassOf = node["rdfs:subClassOf"]; //URI or array of URIs
        let source = node["http://purl.org/dc/terms/source"]; //URI or array of URIs
        let category = node["http://schema.org/category"]; //typed value(obj with @language and @value) or string, or array of those
        let isPartOf = node["http://schema.org/isPartOf"]; //URI, if not given: take from @id - @context

        this.id = node["@id"];  //URI
        this.termType = "Class";
        inputCuration.curateLabel(this, node["rdfs:label"]); //dictionary with language keys or string (which is supposed to be "en" version)
        inputCuration.curateComment(this, node["rdfs:comment"]); //dictionary with language keys or string (which is supposed to be "en" version)

    }

    addData(node) {
        let subclassOf = node["rdfs:subClassOf"];
        let source = node["http://purl.org/dc/terms/source"];
        let category = node["http://schema.org/category"];
        let isPartOf = node["http://schema.org/isPartOf"];

        inputCuration.curateLabel(this, node["rdfs:label"]); //dictionary with language keys or string (which is supposed to be "en" version)
        inputCuration.curateComment(this, node["rdfs:comment"]); //dictionary with language keys or string (which is supposed to be "en" version)

    }
}

module.exports = GraphClass;