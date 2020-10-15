// the functions for a class Object
const util = require('./utilities');
const Term = require('./Term');

class Class extends Term {
    /**
     * A Class represents an rdfs:Class. It is identified by its IRI
     *
     * @class
     * @param {string} IRI - The compacted IRI of this Class, e.g. "schema:Book"
     * @param {Graph} graph - The underlying data graph to enable the methods of this Class
     */
    constructor(IRI, graph) {
        super(IRI, graph);
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
     * Retrieves the term object of this Class
     *
     * @returns {string} The term object of this Class
     */
    getTermObj() {
        return this.graph.classes[this.IRI];
    }

    /**
     * Retrieves the explicit/implicit properties (soa:hasProperty) of this Class
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit properties (inheritance from super-classes)
     * @param {object|null} filter - (default = null) an optional filter for the properties
     * @returns {string[]} The properties of this Class
     */
    getProperties(implicit = true, filter = null) {
        const classObj = this.getTermObj();
        const result = [];
        result.push(...classObj['soa:hasProperty']);
        if (implicit) {
            // add properties from super-classes
            result.push(...this.graph.reasoner.inferPropertiesFromSuperClasses(classObj['rdfs:subClassOf']));
        }
        return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
    }

    /**
     * Retrieves the explicit/implicit super-classes (rdfs:subClassOf) of this Class
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit super-classes (recursive from super-classes)
     * @param {object|null} filter - (default = null) an optional filter for the super-classes
     * @returns {string[]} The super-classes of this Class
     */
    getSuperClasses(implicit = true, filter = null) {
        const classObj = this.getTermObj();
        const result = [];
        if (implicit) {
            result.push(...this.graph.reasoner.inferSuperClasses(this.IRI));
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
     * @returns {string[]} The sub-classes of this Class
     */
    getSubClasses(implicit = true, filter = null) {
        const classObj = this.getTermObj();
        const result = [];
        if (implicit) {
            result.push(...this.graph.reasoner.inferSubClasses(this.IRI));
        } else {
            result.push(...classObj['soa:superClassOf']);
        }
        return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
    }

    /**
     * Retrieves the properties that have this Class as a range
     *
     * @param {boolean} implicit - (default = true) includes also implicit data
     * @param {object|null} filter - (default = null) an optional filter for the generated data
     * @returns {Array} The properties that have this Class as a range
     */
    isRangeOf(implicit = true, filter = null) {
        const result = [];
        if (implicit) {
            result.push(...this.graph.reasoner.inferRangeOf(this.IRI));
        } else {
            result.push(...this.getTermObj()['soa:isRangeOf']);
        }
        return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
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
        // sub-classes and their subclasses
        // super-classes and their superclasses
        const result = super.toJSON();
        result.superClasses = this.getSuperClasses(implicit, filter);
        result.subClasses = this.getSubClasses(implicit, filter);
        result.properties = this.getProperties(implicit, filter);
        result.rangeOf = this.isRangeOf(implicit, filter);
        return result;
    }
}

module.exports = Class;
