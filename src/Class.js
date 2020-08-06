// the functions for a class Object
const util = require('./utilities');

class Class {
    /**
     * A Class represents an rdfs:Class. It is identified by its IRI
     *
     * @class
     * @param {string} IRI - The compacted IRI of this Class, e.g. "schema:Book"
     * @param {Graph} graph - The underlying data graph to enable the methods of this Class
     */
    constructor(IRI, graph) {
        this.IRI = IRI;
        this.graph = graph;
    }

    /**
     * Retrieves the IRI (@id) of this Class in compact/absolute form
     *
     * @param {boolean} compactForm - (default = false), if true -> return compact IRI -> "schema:Book", if false -> return absolute IRI -> "http://schema.org/Book"
     * @returns {string} The IRI (@id) of this Class
     */
    getIRI(compactForm = false) {
        if (compactForm) {
            return this.IRI;
        } else {
            return util.toAbsoluteIRI(this.IRI, this.graph.context);
        }
    }

    /**
     * Retrieves the term type (@type) of this Class (is always "rdfs:Class")
     *
     * @returns {string} The term type of this Class -> "rdfs:Class"
     */
    getTermType() {
        return 'rdfs:Class';
    }

    /**
     * Retrieves the original vocabulary (schema:isPartOf) of this Class
     *
     * @returns {string|null} The vocabulary IRI given by the "schema:isPartOf" of this Class
     */
    getVocabulary() {
        const classObj = this.graph.classes[this.IRI];
        if (classObj['schema:isPartOf'] !== undefined) {
            return classObj['schema:isPartOf'];
        } else {
            return null;
        }
    }

    /**
     * Retrieves the source (dc:source) of this Class
     *
     * @returns {string|null} The source IRI given by the "dc:source" of this Class (null if none)
     */
    getSource() {
        const classObj = this.graph.classes[this.IRI];
        if (classObj['dc:source'] !== undefined) {
            return classObj['dc:source'];
        } else {
            return null;
        }
    }

    /**
     * Retrieves the class superseding (schema:supersededBy) this Class
     *
     * @returns {string|null} The Class superseding this Class (null if none)
     */
    isSupersededBy() {
        const classObj = this.graph.classes[this.IRI];
        if (util.isString(classObj['schema:supersededBy'])) {
            return classObj['schema:supersededBy'];
        } else {
            return null;
        }
    }

    /**
     * Retrieves the name (rdfs:label) of this Class in a wished language (optional)
     *
     * @param {string} language - (default = "en") the wished language for the name
     * @returns {string|null} The name of this Class (null if not given for specified language)
     */
    getName(language = 'en') {
        const nameObj = this.graph.classes[this.IRI]['rdfs:label'];
        if (nameObj === null || nameObj[language] === undefined) {
            return null;
        }
        return nameObj[language];
    }

    /**
     * Retrieves the description (rdfs:comment) of this Class in a wished language (optional)
     *
     * @param {string} language - (default = "en") the wished language for the description
     * @returns {string|null} The description of this Class (null if not given for specified language)
     */
    getDescription(language = 'en') {
        const descriptionObj = this.graph.classes[this.IRI]['rdfs:comment'];
        if (descriptionObj === null || descriptionObj[language] === undefined) {
            return null;
        }
        return descriptionObj[language];
    }

    /**
     * Retrieves the explicit/implicit properties (soa:hasProperty) of this Class
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit properties (inheritance from super-classes)
     * @param {object|null} filter - (default = null) an optional filter for the properties
     * @returns {Array} The properties of this Class
     */
    getProperties(implicit = true, filter = null) {
        const classObj = this.graph.classes[this.IRI];
        const result = [];
        result.push(...classObj['soa:hasProperty']);
        if (implicit === true) {
            // add properties from super-classes
            result.push(...this.graph.reasoner.inferPropertiesFromSuperClasses(classObj['rdfs:subClassOf']));
            // add sub-properties ?
            // for (let p = 0; p < result.length; p++) {
            //     result.push(... this.graph.reasoner.inferSubProperties(result[p]));
            // }
        }
        return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
    }

    /**
     * Retrieves the explicit/implicit super-classes (rdfs:subClassOf) of this Class
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit super-classes (recursive from super-classes)
     * @param {object|null} filter - (default = null) an optional filter for the super-classes
     * @returns {Array} The super-classes of this Class
     */
    getSuperClasses(implicit = true, filter = null) {
        const classObj = this.graph.classes[this.IRI];
        const result = [];

        if (implicit === true) {
            result.push(...this.graph.reasoner.inferImplicitSuperClasses(this.IRI));
        } else {
            result.push(...classObj['rdfs:subClassOf']);
        }
        return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
    }

    /**
     * Retrieves the explicit/implicit sub-classes (soa:superClassOf) of this Class
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit sub-classes (recursive from sub-classes)
     * @param {object|null} filter - (default = null) an optional filter for the sub-classes
     * @returns {Array} The sub-classes of this Class
     */
    getSubClasses(implicit = true, filter = null) {
        const classObj = this.graph.classes[this.IRI];
        const result = [];
        if (implicit === true) {
            result.push(...this.graph.reasoner.inferImplicitSubClasses(this.IRI));
        } else {
            result.push(...classObj['soa:superClassOf']);
        }
        return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
    }

    /**
     * Generates a string representation of this Class (Based on its JSON representation)
     *
     * @returns {string} The string representation of this Class
     */
    toString() {
        return JSON.stringify(this.toJSON(false, null), null, 2);
    }

    /**
     * Generates an explicit/implicit JSON representation of this Class.
     *
     * @param {boolean} implicit - (default = true) includes also implicit data (e.g. sub-Classes, super-Classes, properties, etc.)
     * @param {object|null} filter - (default = null) an optional filter for the generated data
     * @returns {object} The JSON representation of this Class
     */
    toJSON(implicit = true, filter = null) {
    // (implicit === true) ->
    // properties of all parent classes
    // sub-properties of all properties ??
    // sub-classes and their subclasses
    // super-classes and their superclasses
        const result = {};
        result.id = this.getIRI(true);
        result.IRI = this.getIRI();
        result.type = this.getTermType();
        result.vocabulary = this.getVocabulary();
        result.source = this.getSource();
        result.supersededBy = this.isSupersededBy();
        result.name = this.getName();
        result.description = this.getDescription();
        result.superClasses = this.getSuperClasses(implicit, filter);
        result.subClasses = this.getSubClasses(implicit, filter);
        result.properties = this.getProperties(implicit, filter);
        return result;
    }
}

module.exports = Class;
