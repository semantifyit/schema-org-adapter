export = Class;
/**
 * @typedef filterObject
 * @type {object}
 * @property {boolean} [isSuperseded] - defines the superseded status for the filter (true: only terms that are superseded, false: only terms that are NOT superseded)
 * @property {string|string[]} [fromVocabulary] - defines a set of allowed vocabularies for the filter - vocabularies are given as indicators (e.g. "schema")
 * @property {string|string[]} [termType] - defines a set of allowed term types for the filter (e.g. "Class", "Property")
 */
declare class Class extends Term {
    /**
     * A Class represents an rdfs:Class. It is identified by its IRI
     *
     * @class
     * @param {string} IRI - The compacted IRI of this Class, e.g. "schema:Book"
     * @param {Graph} graph - The underlying data graph to enable the methods of this Class
     */
    constructor(IRI: string, graph: any);
    /**
     * Retrieves the explicit/implicit properties (soa:hasProperty) of this Class
     *
     * @param {boolean} [implicit = true] - retrieves also implicit properties (inheritance from super-classes) - (default = true)
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {string[]} The properties of this Class
     */
    getProperties(implicit?: boolean, filter?: filterObject): string[];
    /**
     * Retrieves the explicit/implicit super-classes (rdfs:subClassOf) of this Class
     *
     * @param {boolean} [implicit = true] - retrieves also implicit super-classes (recursive from super-classes) - (default = true)
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {string[]} The super-classes of this Class
     */
    getSuperClasses(implicit?: boolean, filter?: filterObject): string[];
    /**
     * Retrieves the explicit/implicit sub-classes (soa:superClassOf) of this Class
     *
     * @param {boolean} [implicit = true] - retrieves also implicit sub-classes (recursive from sub-classes) - (default = true)
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {string[]} The sub-classes of this Class
     */
    getSubClasses(implicit?: boolean, filter?: filterObject): string[];
    /**
     * Retrieves the properties that have this Class as a range
     *
     * @param {boolean} [implicit = true] - includes also implicit data - (default = true)
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {string[]} The properties that have this Class as a range
     */
    isRangeOf(implicit?: boolean, filter?: filterObject): string[];
}
declare namespace Class {
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
