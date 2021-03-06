// the functions for a enumeration Object
const util = require('./utilities');
const Class = require('./Class');

class Enumeration extends Class {
    /**
     * An Enumeration represents a schema:Enumeration, which is also a sub-type of an rdfs:Class. It is identified by its IRI
     *
     * @class
     * @param {string} IRI - The compacted IRI of this Enumeration, e.g. "schema:DayOfWeek"
     * @param {Graph} graph - The underlying data graph to enable the methods of this Enumeration
     */
    constructor(IRI, graph) {
        super(IRI, graph);
    }

    /**
     * Retrieves the term type (@type) of this Enumeration (is always "schema:Enumeration")
     *
     * @returns {string} The term type of this Enumeration -> "schema:Enumeration"
     */
    getTermType() {
        return 'schema:Enumeration';
    }

    /**
     * Retrieves the term object of this Enumeration
     *
     * @returns {string} The term object of this Enumeration
     */
    getTermObj() {
        return this.graph.enumerations[this.IRI];
    }

    /**
     * Retrieves the enumeration members (soa:hasEnumerationMember) of this Enumeration
     *
     * @param {boolean} implicit - (default = false) retrieves also implicit enumeration members (inheritance from sub-enumerations)
     * @param {object|null} filter - (default = null) an optional filter for the enumeration members
     * @returns {string[]} The enumeration members of this Enumeration
     */
    getEnumerationMembers(implicit = false, filter = null) {
        const result = [];
        result.push(...this.getTermObj()['soa:hasEnumerationMember']);
        if (implicit) {
            const subClasses = this.getSubClasses(true, null);
            for (const actSubClass of subClasses) {
                const actualEnumeration = this.graph.enumerations[actSubClass];
                if (!util.isNil(actualEnumeration)) {
                    result.push(...actualEnumeration['soa:hasEnumerationMember']);
                }
            }
        }
        return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
    }

    /**
     * Generates an explicit/implicit JSON representation of this Enumeration
     *
     * @param {boolean} implicit - (default = true) includes also implicit data
     * @param {object|null} filter - (default = null) an optional filter for the generated data
     * @returns {object} The JSON representation of this Enumeration
     */
    toJSON(implicit = true, filter = null) {
        const result = super.toJSON(implicit, filter);
        result.enumerationMembers = this.getEnumerationMembers(implicit, filter);
        return result;
    }
}

module.exports = Enumeration;
