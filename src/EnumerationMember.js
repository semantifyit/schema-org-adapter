// the functions for a enumeration member Object
const util = require('./utilities');

class EnumerationMember {
    /**
     * An EnumerationMember represents a possible value for a schema:Enumeration. It is identified by its IRI
     *
     * @class
     * @param {string} IRI - The compacted IRI of this EnumerationMember, e.g. "schema:Friday"
     * @param {Graph} graph - The underlying data graph to enable the methods of this EnumerationMember
     */
    constructor(IRI, graph) {
        this.IRI = IRI;
        this.graph = graph;
    }

    /**
     * Retrieves the IRI (@id) of this EnumerationMember in compact/absolute form
     *
     * @param {boolean} compactForm - (default = false), if true -> return compact IRI -> "schema:Friday", if false -> return absolute IRI -> "http://schema.org/Friday"
     * @returns {string} The IRI (@id) of this EnumerationMember
     */
    getIRI(compactForm = false) {
        if (compactForm) {
            return this.IRI;
        } else {
            return util.toAbsoluteIRI(this.IRI, this.graph.context);
        }
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
     * Retrieves the original vocabulary (schema:isPartOf) of this EnumerationMember
     *
     * @returns {string|null} The vocabulary IRI given by the "schema:isPartOf" of this EnumerationMember
     */
    getVocabulary() {
        let enumObj = this.graph.enumerationMembers[this.IRI];
        if (enumObj['schema:isPartOf'] !== undefined) {
            return enumObj['schema:isPartOf'];
        } else {
            return null;
        }
    }

    /**
     * Retrieves the source (dc:source) of this EnumerationMember
     *
     * @returns {string|Array|null} The source IRI given by the "dc:source" of this EnumerationMember (null if none)
     */
    getSource() {
        let enumObj = this.graph.enumerationMembers[this.IRI];
        if (enumObj['dc:source'] !== undefined) {
            return enumObj['dc:source'];
        } else if (enumObj['schema:source']) {
            return enumObj['schema:source'];
        } else {
            return null;
        }
    }

    /**
     * Retrieves the EnumerationMember superseding (schema:supersededBy) this EnumerationMember
     *
     * @returns {string|null} The EnumerationMember superseding this EnumerationMember (null if none)
     */
    isSupersededBy() {
        let enumObj = this.graph.enumerationMembers[this.IRI];
        if (util.isString(enumObj['schema:supersededBy'])) {
            return enumObj['schema:supersededBy'];
        } else {
            return null;
        }
    }

    /**
     * Retrieves the name (rdfs:label) of this EnumerationMember in a wished language (optional)
     *
     * @param {string} language - (default = "en") the wished language for the name
     * @returns {string|null} The name of this EnumerationMember (null if not given for specified language)
     */
    getName(language = 'en') {
        let nameObj = this.graph.enumerationMembers[this.IRI]['rdfs:label'];
        if (nameObj === null || nameObj[language] === undefined) {
            return null;
        }
        return nameObj[language];
    }

    /**
     * Retrieves the description (rdfs:comment) of this EnumerationMember in a wished language (optional)
     *
     * @param {string} language - (default = "en") the wished language for the description
     * @returns {string|null} The description of this EnumerationMember (null if not given for specified language)
     */
    getDescription(language = 'en') {
        let descriptionObj = this.graph.enumerationMembers[this.IRI]['rdfs:comment'];
        if (descriptionObj === null || descriptionObj[language] === undefined) {
            return null;
        }
        return descriptionObj[language];
    }

    /**
     * Retrieves the domain enumerations (soa:enumerationDomainIncludes) of this EnumerationMember
     *
     * @param {boolean} implicit - (default = false) retrieves also implicit domain enumerations (inheritance from super-enumerations)
     * @param {object|null} filter - (default = null) an optional filter for the domain enumerations
     * @returns {Array} The domain enumerations of this EnumerationMember
     */
    getDomainEnumerations(implicit = false, filter = null) {
        let enumObj = this.graph.enumerationMembers[this.IRI];
        let result = [];
        result.push(...enumObj['soa:enumerationDomainIncludes']);
        if (implicit === true) {
            let domainEnumerationsToCheck = JSON.parse(JSON.stringify(result));
            for (let i = 0; i < domainEnumerationsToCheck.length; i++) {
                result.push(...this.graph.reasoner.inferImplicitSuperClasses(domainEnumerationsToCheck[i]));
            }
            result = util.applyFilter(util.uniquifyArray(result), { 'termType': 'Enumeration' }, this.graph);
        }
        return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
    }

    /**
     * Generates a string representation of this EnumerationMember (Based on its JSON representation)
     *
     * @returns {string} The string representation of this EnumerationMember
     */
    toString() {
        return JSON.stringify(this.toJSON(false, null), null, 2);
    }

    /**
     * Generates a JSON representation of this EnumerationMember
     *
     * @param {boolean} implicit - (default = false) includes also implicit data
     * @param {object|null} filter - (default = null) an optional filter for the generated data
     * @returns {object} The JSON representation of this EnumerationMember
     */
    toJSON(implicit = false, filter = null) {
        let result = {};
        result['id'] = this.getIRI(true);
        result['IRI'] = this.getIRI();
        result['type'] = this.getTermType();
        result['vocabulary'] = this.getVocabulary();
        result['source'] = this.getSource();
        result['supersededBy'] = this.isSupersededBy();
        result['name'] = this.getName();
        result['description'] = this.getDescription();
        result['domainEnumerations'] = this.getDomainEnumerations(implicit, filter);
        return result;
    }
}

module.exports = EnumerationMember;