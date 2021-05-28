// the functions for a enumeration member Object
const util = require('./utilities');
const Term = require('./Term');

class EnumerationMember extends Term {
    /**
     * An EnumerationMember represents a possible value for a schema:Enumeration. It is identified by its IRI
     *
     * @class
     * @param {string} IRI - The compacted IRI of this EnumerationMember, e.g. "schema:Friday"
     * @param {Graph} graph - The underlying data graph to enable the methods of this EnumerationMember
     */
    constructor(IRI, graph) {
        super(IRI, graph);
    }

    /**
     * Retrieves the term type (@type) of this EnumerationMember (is always "schema:Enumeration")
     *
     * @returns {string} The term type of this EnumerationMember -> "soa:EnumerationMember" //there is no explicit type for enumeration members in the Schema.org Meta, so we use our own definition
     */
    getTermType() {
        return 'soa:EnumerationMember';
    }

    /**
     * Retrieves the term object of this Enumeration Member
     *
     * @returns {string} The term object of this Enumeration Member
     */
    getTermObj() {
        return this.graph.enumerationMembers[this.IRI];
    }

    /**
     * Retrieves the domain enumerations (soa:enumerationDomainIncludes) of this EnumerationMember
     *
     * @param {boolean} implicit - (default = false) retrieves also implicit domain enumerations (inheritance from super-enumerations)
     * @param {object|null} filter - (default = null) an optional filter for the domain enumerations
     * @returns {string[]} The domain enumerations of this EnumerationMember
     */
    getDomainEnumerations(implicit = false, filter = null) {
        let enumObj = this.getTermObj();
        let result = [];
        result.push(...enumObj['soa:enumerationDomainIncludes']);
        if (implicit) {
            let domainEnumerationsToCheck = util.copByVal(result);
            for (const actDE of domainEnumerationsToCheck) {
                result.push(...this.graph.reasoner.inferSuperClasses(actDE));
            }
            result = util.applyFilter(util.uniquifyArray(result), { 'termType': 'Enumeration' }, this.graph);
        }
        return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
    }

    /**
     * Generates a JSON representation of this EnumerationMember
     *
     * @param {boolean} implicit - (default = false) includes also implicit data
     * @param {object|null} filter - (default = null) an optional filter for the generated data
     * @returns {object} The JSON representation of this EnumerationMember
     */
    toJSON(implicit = false, filter = null) {
        const result = super.toJSON();
        result['domainEnumerations'] = this.getDomainEnumerations(implicit, filter);
        return result;
    }
}

module.exports = EnumerationMember;
