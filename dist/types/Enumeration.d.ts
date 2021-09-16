export = Enumeration;
/**
 * @typedef filterObject
 * @type {object}
 * @property {boolean} [isSuperseded] - defines the superseded status for the filter (true: only terms that are superseded, false: only terms that are NOT superseded)
 * @property {string|string[]} [fromVocabulary] - defines a set of allowed vocabularies for the filter - vocabularies are given as indicators (e.g. "schema")
 * @property {string|string[]} [termType] - defines a set of allowed term types for the filter (e.g. "Class", "Property")
 */
declare class Enumeration extends Class {
    /**
     * Retrieves the enumeration members (soa:hasEnumerationMember) of this Enumeration
     *
     * @param {boolean} [implicit = true] - retrieves also implicit enumeration members (inheritance from sub-enumerations) - (default = false)
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {string[]} The enumeration members of this Enumeration
     */
    getEnumerationMembers(implicit?: boolean, filter?: filterObject): string[];
}
declare namespace Enumeration {
    export { filterObject };
}
import Class = require("./Class");
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
