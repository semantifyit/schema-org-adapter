export = EnumerationMember;
/**
 * @typedef filterObject
 * @type {object}
 * @property {boolean} [isSuperseded] - defines the superseded status for the filter (true: only terms that are superseded, false: only terms that are NOT superseded)
 * @property {string|string[]} [fromVocabulary] - defines a set of allowed vocabularies for the filter - vocabularies are given as indicators (e.g. "schema")
 * @property {string|string[]} [termType] - defines a set of allowed term types for the filter (e.g. "Class", "Property")
 */
declare class EnumerationMember extends Term {
    /**
     * An EnumerationMember represents a possible value for a schema:Enumeration. It is identified by its IRI
     *
     * @class
     * @param {string} IRI - The compacted IRI of this EnumerationMember, e.g. "schema:Friday"
     * @param {Graph} graph - The underlying data graph to enable the methods of this EnumerationMember
     */
    constructor(IRI: string, graph: any);
    /**
     * Retrieves the domain enumerations (soa:enumerationDomainIncludes) of this EnumerationMember
     *
     * @param {boolean} [implicit = true] - retrieves also implicit domain enumerations (inheritance from super-enumerations) - (default = false)
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {string[]} The domain enumerations of this EnumerationMember
     */
    getDomainEnumerations(implicit?: boolean, filter?: filterObject): string[];
}
declare namespace EnumerationMember {
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
