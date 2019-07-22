//the functions for a class Object

class Class {
    constructor(id, graph) {
        this.id = id; //should be the written out version e.g. http://schema.org/MediaObject
        this.graph = graph; //the underlying data graph to enable the methods
    }

    getId() {
        return this.id;
    }

    getName(language = "en") {
        let nameObj = this.graph.classes[this.id].label;
        if (nameObj === null) {
            return null;
        }
        return nameObj[language];
    }

    getDescription(language = "en") {
        let descriptionObj = this.graph.classes[this.id].comment;
        if (descriptionObj === null) {
            return null;
        }
        return descriptionObj[language];
    }

    toJSON(explicit) {
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

module.exports = Class;