//the functions for a property Object
const util = require("./utilities");

class Property {
    constructor(IRI, graph) {
        this.IRI = IRI; //should be the written out version e.g. http://schema.org/MediaObject ?
        this.graph = graph; //the underlying data graph to enable the methods
    }

    static getTermType() {
        return "Property";
    }


    getIRI(useVocabIndicator = true) {
        return this.IRI;
    }

    getName(language = "en") {
        let nameObj = this.graph.classes[this.graph.transformURI(this.URI)]["rdfs:label"];
        if (nameObj === null || nameObj[language] === undefined) {
            return null;
        }
        return nameObj[language];
    }

    getDescription(language = "en") {
        let descriptionObj = this.graph.classes[this.graph.transformURI(this.URI)]["rdfs:comment"];
        if (descriptionObj === null || descriptionObj[language] === undefined) {
            return null;
        }
        return descriptionObj[language];
    }

    isSuperseededBy(){
        //return null if undefined, return IRI of superseeded if any schema:supersededBy
        let classObj = this.graph.properties[this.IRI];
        if(util.isString(classObj["schema:supersededBy"])){
            return classObj["schema:supersededBy"];
        } else {
            return null;
        }
    }

    toJSON(explicit = false) {
        // explicit === true ->
        // properties of all parent classes
        // subproperties of all properties
        // subclasses and their subclasses
        // superclasses and their superclasses
        let result = {};
        result["@id"] = this.getId();
        result["name"] = this.getName();
        result["description"] = this.getDescription();
        return result;
    }
}

module.exports = Property;