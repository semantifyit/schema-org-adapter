export = DataType;
declare class DataType extends Term {
    /**
     * Retrieves the explicit/implicit super-DataTypes (rdfs:subClassOf) of this DataType
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit super-DataTypes (recursive from super-DataTypes)
     * @param {object|null} filter - (default = null) an optional filter for the super-DataTypes
     * @returns {string[]} The super-DataTypes of this DataType
     */
    getSuperDataTypes(implicit?: boolean, filter?: object | null): string[];
    /**
     * Retrieves the explicit/implicit sub-DataTypes (soa:superClassOf) of this DataType
     *
     * @param {boolean} implicit - (default = true) retrieves also implicit sub-DataTypes (recursive from sub-DataTypes)
     * @param {object|null} filter - (default = null) an optional filter for the sub-DataTypes
     * @returns {string[]} The sub-DataTypes of this DataType
     */
    getSubDataTypes(implicit?: boolean, filter?: object | null): string[];
    /**
     * Retrieves the properties that have this DataType as a range
     *
     * @param {boolean} implicit - (default = true) includes also implicit data
     * @param {object|null} filter - (default = null) an optional filter for the generated data
     * @returns {Array} The properties that have this DataType as a range
     */
    isRangeOf(implicit?: boolean, filter?: object | null): any[];
}
import Term = require("./Term");
