// the functions for a property Object
const util = require('./utilities');

class Property {
    /**
     * A Property represents an rdf:Property. It is identified by its IRI
     *
     * @class
     * @param {string} IRI - The compacted IRI of this Property, e.g. "schema:address"
     * @param {Graph} graph - The underlying data graph to enable the methods of this Property
     */
    constructor(IRI, graph) {
        this.IRI = IRI;
        this.graph = graph;
    }

    /**
     * Retrieves the IRI (@id) of this Property in compact/absolute form
     *
     * @param {boolean} compactForm - (default = false), if true -> return compact IRI -> "schema:address", if false -> return absolute IRI -> "http://schema.org/address"
     * @returns {string} The IRI (@id) of this Property
     */
    getIRI(compactForm = false) {
        if (compactForm) {
            return this.IRI;
        }
        return util.toAbsoluteIRI(this.IRI, this.graph.context);
    }

    /**
     * Retrieves the term type of this Property (is always "rdf:Property")
     *
     * @returns {string} The term type of this Property -> "rdf:Property"
     */
    getTermType() {
        return 'rdf:Property';
    }

    /**
     * Retrieves the original vocabulary (schema:isPartOf) of this Property
     *
     * @returns {string|null} The vocabulary IRI given by the "schema:isPartOf" of this Property
     */
    getVocabulary() {
        let propertyObj = this.graph.properties[this.IRI];
        if (!util.isNil(propertyObj['schema:isPartOf'])) {
            return propertyObj['schema:isPartOf'];
        }
        return null;
    }

    /**
     * Retrieves the source (dc:source) of this Property
     *
     * @returns {string|null} The source IRI given by the "dc:source" of this Property (null if none)
     */
    getSource() {
        let propertyObj = this.graph.properties[this.IRI];
        if (!util.isNil(propertyObj['dc:source'])) {
            return propertyObj['dc:source'];
        } else if (!util.isNil(propertyObj['schema:source'])) {
            return propertyObj['schema:source'];
        }
        return null;
    }

    /**
     * Retrieves the Property superseding (schema:supersededBy) this Property
     *
     * @returns {string|null} The Property superseding this Property (null if none)
     */
    isSupersededBy() {
        let propertyObj = this.graph.properties[this.IRI];
        if (util.isString(propertyObj['schema:supersededBy'])) {
            return propertyObj['schema:supersededBy'];
        }
        return null;
    }

    /**
     * Retrieves the name (rdfs:label) of this Property in a wished language (optional)
     *
     * @param {string} language - (default = "en") the wished language for the name
     * @returns {string|null} The name of this Property (null if not given for specified language)
     */
    getName(language = 'en') {
        let nameObj = this.graph.properties[this.IRI]['rdfs:label'];
        if (util.isNil(nameObj) || util.isNil(nameObj[language])) {
            return null;
        }
        return nameObj[language];
    }

    /**
     * Retrieves the description (rdfs:comment) of this Property in a wished language (optional)
     *
     * @param {string} language - (default = "en") the wished language for the description
     * @returns {string|null} The description of this Property (null if not given for specified language)
     */
    getDescription(language = 'en') {
        let descriptionObj = this.graph.properties[this.IRI]['rdfs:comment'];
        if (util.isNil(descriptionObj) || util.isNil(descriptionObj[language])) {
            return null;
        }
        return descriptionObj[language];
    }

    /**
     * Retrieves the explicit/implicit ranges (schema:rangeIncludes) of this Property
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit ranges (inheritance from sub-classes of the ranges)
     * @param {object|null} filter - (default = null) an optional filter for the ranges
     * @returns {string[]} The ranges of this Property
     */
    getRanges(implicit = true, filter = null) {
        let propertyObj = this.graph.properties[this.IRI];
        let result = [];
        result.push(...propertyObj['schema:rangeIncludes']);
        if (implicit) {
            // add sub-classes from ranges
            let inferredSubClasses = [];
            for (const actRes of result) {
                inferredSubClasses.push(...this.graph.reasoner.inferSubClasses(actRes));
            }
            result.push(...inferredSubClasses);
            // remove "null" values from array (if range included data types)
            result = result.filter(function(el) {
                return el !== null;
            });
        }
        return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
    }

    /**
     * Retrieves the explicit/implicit domains (schema:domainIncludes) of this Property
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit domains (inheritance from sub-classes of the domains)
     * @param {object|null} filter - (default = null) an optional filter for the domains
     * @returns {string[]} The domains of this Property
     */
    getDomains(implicit = true, filter = null) {
        let propertyObj = this.graph.properties[this.IRI];
        let result = [];
        result.push(...propertyObj['schema:domainIncludes']);
        if (implicit) {
            // add sub-classes from ranges
            let inferredSubClasses = [];
            for (const actRes of result) {
                inferredSubClasses.push(...this.graph.reasoner.inferSubClasses(actRes));
            }
            result.push(...inferredSubClasses);
        }
        return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
    }

    /**
     * Retrieves the explicit/implicit super-properties (rdfs:subPropertyOf) of this Property
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit super-properties (recursive from super-properties)
     * @param {object|null} filter - (default = null) an optional filter for the super-properties
     * @returns {string[]} The super-properties of this Property
     */
    getSuperProperties(implicit = true, filter = null) {
        let propertyObj = this.graph.properties[this.IRI];
        let result = [];

        if (implicit) {
            result.push(...this.graph.reasoner.inferSuperProperties(this.IRI));
        } else {
            result.push(...propertyObj['rdfs:subPropertyOf']);
        }
        return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
    }

    /**
     * Retrieves the explicit/implicit sub-properties (soa:superPropertyOf) of this Property
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit sub-properties (recursive from sub-properties)
     * @param {object|null} filter - (default = null) an optional filter for the sub-properties
     * @returns {string[]} The sub-properties of this Property
     */
    getSubProperties(implicit = true, filter = null) {
        let propertyObj = this.graph.properties[this.IRI];
        let result = [];

        if (implicit) {
            result.push(...this.graph.reasoner.inferSubProperties(this.IRI));
        } else {
            result.push(...propertyObj['soa:superPropertyOf']);
        }
        return util.applyFilter(util.uniquifyArray(result), filter, this.graph);
    }

    /**
     * Retrieves the inverse Property (schema:inverseOf) of this Property
     *
     * @returns {string} The IRI of the inverse Property of this Property
     */
    getInverseOf() {
        let propertyObj = this.graph.properties[this.IRI];
        return propertyObj['schema:inverseOf'];
    }

    /**
     * Generates a string representation of this Property (Based on its JSON representation)
     *
     * @returns {string} The string representation of this Property
     */
    toString() {
        return JSON.stringify(this.toJSON(false, null), null, 2);
    }

    /**
     * Generates an explicit/implicit JSON representation of this Property.
     *
     * @param {boolean} implicit - (default = true) includes also implicit data (e.g. domains, ranges, etc.)
     * @param {object|null} filter - (default = null) an optional filter for the generated data
     * @returns {object} The JSON representation of this Class
     */
    toJSON(implicit = true, filter = null) {
        let result = {};
        result['id'] = this.getIRI(true);
        result['IRI'] = this.getIRI();
        result['type'] = this.getTermType();
        result['vocabulary'] = this.getVocabulary();
        result['source'] = this.getSource();
        result['supersededBy'] = this.isSupersededBy();
        result['name'] = this.getName();
        result['description'] = this.getDescription();
        result['ranges'] = this.getRanges(implicit, filter);
        result['domains'] = this.getDomains(implicit, filter);
        result['superProperties'] = this.getSuperProperties(implicit, filter);
        result['subProperties'] = this.getSubProperties(implicit, filter);
        result['inverseOf'] = this.getInverseOf();
        return result;
    }
}

module.exports = Property;