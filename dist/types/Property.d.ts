export = Property;
/**
 * @typedef filterObject
 * @type {object}
 * @property {boolean} [isSuperseded] - defines the superseded status for the filter (true: only terms that are superseded, false: only terms that are NOT superseded)
 * @property {string|string[]} [fromVocabulary] - defines a set of allowed vocabularies for the filter - vocabularies are given as indicators (e.g. "schema")
 * @property {string|string[]} [termType] - defines a set of allowed term types for the filter (e.g. "Class", "Property")
 */
declare class Property extends Term {
    /**
     * A Property represents an rdf:Property. It is identified by its IRI
     *
     * @class
     * @param {string} IRI - The compacted IRI of this Property, e.g. "schema:address"
     * @param {Graph} graph - The underlying data graph to enable the methods of this Property
     */
    constructor(IRI: string, graph: any);
    /**
     * Retrieves the explicit/implicit ranges (schema:rangeIncludes) of this Property
     *
     * @param {boolean} [implicit = true] - retrieves also implicit ranges (inheritance from sub-classes of the ranges) - (default = true)
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {string[]} The ranges of this Property
     */
    getRanges(implicit?: boolean, filter?: filterObject): string[];
    /**
     * Retrieves the explicit/implicit domains (schema:domainIncludes) of this Property
     *
     * @param {boolean} [implicit = true] - retrieves also implicit domains (inheritance from sub-classes of the domains) - (default = true)
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {string[]} The domains of this Property
     */
    getDomains(implicit?: boolean, filter?: filterObject): string[];
    /**
     * Retrieves the explicit/implicit super-properties (rdfs:subPropertyOf) of this Property
     *
     * @param {boolean} [implicit = true] - retrieves also implicit super-properties (recursive from super-properties) - (default = true)
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {string[]} The super-properties of this Property
     */
    getSuperProperties(implicit?: boolean, filter?: filterObject): string[];
    /**
     * Retrieves the explicit/implicit sub-properties (soa:superPropertyOf) of this Property
     *
     * @param {boolean} [implicit = true] - retrieves also implicit sub-properties (recursive from sub-properties) - (default = true)
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {string[]} The sub-properties of this Property
     */
    getSubProperties(implicit?: boolean, filter?: filterObject): string[];
    /**
     * Retrieves the inverse Property (schema:inverseOf) of this Property
     *
     * @returns {string} The IRI of the inverse Property of this Property
     */
    getInverseOf(): string;
}
declare namespace Property {
    export { filterObject };
}
import Term = require("./Term");
type filterObject = {
    /**
     * - defines the superseded status for the filter (true: only terms that are superseded, false: only terms that are NOT superseded)
     */
    isSuperseded?: boolean;
    /**
     * - defines a set of allowed vocabularies for the filter - vocabularies are given as indicators (e.g. "schema")
     */
    fromVocabulary?: string | string[];
    /**
     * - defines a set of allowed term types for the filter (e.g. "Class", "Property")
     */
    termType?: string | string[];
};
