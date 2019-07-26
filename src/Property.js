//the functions for a property Object
const util = require("./utilities");

class Property {
    /**
     * A Property represents an rdf:Property. It is identified by its IRI
     * @constructor
     * @param {string} IRI - The compacted IRI of this Property, e.g. "schema:address"
     * @param {object} graph - The underlying data graph to enable the methods of this Property
     */
    constructor(IRI, graph) {
        this.IRI = IRI;
        this.graph = graph;
    }

    /**
     * Retrieves the term type of this Property (is always "rdf:Property")
     * @returns {string} The term type of this Property -> "rdf:Property"
     */
    getTermType() {
        return "rdf:Property";
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

    /**
     * Retrieves the class superseding (schema:supersededBy) this Class
     * @returns {string|null} The Class superseding this Class (null if none)
     */
    isSupersededBy() {
        let propertyObj = this.graph.properties[this.IRI];
        if (util.isString(propertyObj["schema:supersededBy"])) {
            return propertyObj["schema:supersededBy"];
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