//the functions for a property Object

class Property {
    constructor(URI, graph) {
        this.URI = URI; //should be the written out version e.g. http://schema.org/MediaObject ?
        this.graph = graph; //the underlying data graph to enable the methods
    }

    getURI(useVocabIndicator = true) {
        return this.URI;
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