//the functions for a class Object
const util = require("./utilities");

class Class {
    constructor(IRI, graph) {
        this.IRI = IRI; //the compacted IRI of this class, e.g. "schema:Book"
        this.graph = graph; //the underlying data graph to enable the methods
    }

    static getTermType() {
        return "Class";
    }

    getIRI(compactedForm = false) {
        //compactedForm = true -> return compacted IRI -> "schema:Book"
        //compactedForm = false -> return absolute IRI -> "http://schema.org/Book"
        if (compactedForm) {
            return this.IRI;
        } else {
            return util.toAbsoluteIRI(this.IRI, this.graph.context);
        }
    }

    getName(language = "en") {
        let nameObj = this.graph.classes[this.IRI]["rdfs:label"];
        if (nameObj === null || nameObj[language] === undefined) {
            return null;
        }
        return nameObj[language];
    }

    getDescription(language = "en") {
        let descriptionObj = this.graph.classes[this.IRI]["rdfs:comment"];
        if (descriptionObj === null || descriptionObj[language] === undefined) {
            return null;
        }
        return descriptionObj[language];
    }

    getProperties(explicit = false, filter = null) {
        let classObj = this.graph.classes[this.IRI];
        let result = [];
        result.push(... classObj["soa:hasProperty"]);
        if (explicit === false) {
            result.push(... this.graph.reasoner.inferPropertiesFromSuperClasses(classObj["rdfs:subClassOf"]));
        }
        return util.applyFilter(util.uniquifyArray(result), filter);
    }


    toString() {
        return this.toJSON(true);
    }

    toJSON(explicit = true) {
        // explicit === false (implicit === true) ->
        // properties of all parent classes
        // subproperties of all properties
        // subclasses and their subclasses
        // superclasses and their superclasses
        let result = {};
        result["@id"] = this.getIRI();
        result["name"] = this.getName();
        result["description"] = this.getDescription();
        result["properties"] = this.getProperties(explicit);
        return result;
    }
}

module.exports = Class;