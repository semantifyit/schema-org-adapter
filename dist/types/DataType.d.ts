export = DataType;
/**
 * @typedef filterObject
 * @type {object}
 * @property {boolean} [isSuperseded] - defines the superseded status for the filter (true: only terms that are superseded, false: only terms that are NOT superseded)
 * @property {string|string[]} [fromVocabulary] - defines a set of allowed vocabularies for the filter - vocabularies are given as indicators (e.g. "schema")
 * @property {string|string[]} [termType] - defines a set of allowed term types for the filter (e.g. "Class", "Property")
 */
declare class DataType extends Term {
    /**
     * A DataType represents an schema:DataType. It is identified by its IRI
     *
     * @class
     * @param {string} IRI - The compacted IRI of this DataType, e.g. "schema:Number"
     * @param {Graph} graph - The underlying data graph to enable the methods of this DataType
     */
    constructor(IRI: string, graph: any);
    /**
     * Retrieves the explicit/implicit super-DataTypes (rdfs:subClassOf) of this DataType
     *
     * @param {boolean} [implicit = true] - retrieves also implicit super-DataTypes (recursive from super-DataTypes) - (default = true)
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {string[]} The super-DataTypes of this DataType
     */
    getSuperDataTypes(implicit?: boolean, filter?: filterObject): string[];
    /**
     * Retrieves the explicit/implicit sub-DataTypes (soa:superClassOf) of this DataType
     *
     * @param {boolean} [implicit = true] - retrieves also implicit sub-DataTypes (recursive from sub-DataTypes) - (default = true)
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {string[]} The sub-DataTypes of this DataType
     */
    getSubDataTypes(implicit?: boolean, filter?: filterObject): string[];
    /**
     * Retrieves the properties that have this DataType as a range
     *
     * @param {boolean} [implicit = true] - includes also implicit data - (default = true)
     * @param {filterObject} [filter] - (optional) The filter settings to be applied on the result
     * @returns {string[]} The properties that have this DataType as a range
     */
    isRangeOf(implicit?: boolean, filter?: filterObject): string[];
}
declare namespace DataType {
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
